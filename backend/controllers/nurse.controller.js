import Counter from "../models/counter.model.js";
import Nurse from "../models/nurse.model.js";
import Task from "../models/tasks.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const signup = async (req, res) => {
    const nurse = req.body;

    if (!nurse.name || !nurse.email || !nurse.password) {
        return res.status(400).json({
            message: "Please fill all the fields",
            success: false
        });
    }

    try {
        const email = nurse.email;
        const existingnurse = await Nurse.findOne({ email });

        if (existingnurse) {
            return res.status(409).json({ 
                success: false,
                message: "Email is already registered", 
            });
        }

        const counter = await Counter.findByIdAndUpdate(
            { _id: "nurseId" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        const id = counter.seq.toString().padStart(6, "0");

        const hashedPassword = await bcrypt.hash(nurse.password, 15);
        const newNurse = new Nurse({
            ...nurse,
            id,
            password: hashedPassword
        });

        await newNurse.save();

        return res.status(201).json({ 
            success: true, 
            data: newNurse 
        });

    } catch (error) {
        console.error("Error in nurse.controller:", error.message);
        return res.status(500).json({ 
            success: false, 
            message: "Server error" 
        });
    }
};


export const getUsers = async (req, res) => {
    try{
        const users = await User.find({}, "name id profileImg email tasks");

        res.status(200).json({users})

    }catch (error){
        res.status(500).json({ success: false, message: "Failed to get users", error: error.message });
    }
}


export const getUserDetails = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findOne({ id: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            name: user.name,
            email: user.email,
            heartRate: user.heartRate,
            sugarLevel: user.sugarLevel,
            bloodPressure: user.bloodPressure,
            bloodType: user.bloodType,
            description: user.description,
            nurse: user.nurse,
        });
    } catch (error) {
        console.error("Error fetching user details:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

export const updateUserDetails = async (req, res) => {
    const { userId } = req.params;
    const { heartRate, sugarLevel, bloodPressure, bloodType, description } = req.body;

    try {
        const user = await User.findOne({ id: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.heartRate = heartRate ?? user.heartRate;
        user.sugarLevel = sugarLevel ?? user.sugarLevel;
        user.bloodPressure = bloodPressure ?? user.bloodPressure;
        user.bloodType = bloodType ?? user.bloodType;
        user.description = description ?? user.description;

        await user.save();

        res.status(200).json({ message: "User details updated", data: user });
    } catch (error) {
        console.error("Error updating user details:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

export const updateProfile = async (req, res) => {
    const { name, email, yearsOfExperience, username, phoneNo } = req.body;
    const nurseId = req.user.id;
  
    try {
      const updatedNurse = await Nurse.findByIdAndUpdate(
        nurseId,
        { name, email, yearsOfExperience, username, phoneNo },
        { new: true }
      );
  
      if (!updatedNurse) {
        return res.status(404).json({ message: "Nurse not found" });
      }
  
      res.status(200).json({ message: "Profile updated", data: updatedNurse });
    } catch (error) {
      console.error("Update failed:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  };

export const getProfile = async (req, res) => {
  const nurseId = req.user.id;
  console.log("req.user:", req.user);


  try {
    const nurse = await Nurse.findById(nurseId).select("-password");
    if (!nurse) {
      return res.status(404).json({ message: "Nurse not found" });
    }

    res.status(200).json({ message: "Nurse profile fetched", data: nurse });
  } catch (error) {
    console.error("Failed to get nurse profile:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const assignTask = async (req, res) => {
    const assignedBy = req.user._id;
    const assignedToParam = req.params.id;

    const { schedule, frequency, startTime, endTime } = req.body;

    let assignedTo = [];

    if (assignedToParam) {
        if (!assignedToParam.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const user = await User.findById(assignedToParam);
        if (!user) return res.status(404).json({ message: "User not found" });
        assignedTo = [user._id]; 
    } else {
        const allUsers = await User.find();
        assignedTo = allUsers.map(user => user._id);
    }

    const task = new Task({ schedule, frequency, startTime, endTime, assignedTo });
    await task.save();

    if (assignedToParam) {
        await User.findByIdAndUpdate(assignedToParam, { $push: { tasks: task._id } });
        return res.status(200).json({ message: "Task assigned to user" });
    } else {
        await User.updateMany({}, { $push: { tasks: task._id } });
        return res.status(200).json({ message: "Task assigned to all users" });
    }
};

export const deleteUser = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "nurse") {
        return res.status(403).json({ message: "Access denied. Only nurses can delete users." });
        }

        const { userId } = req.params;

        if (req.user.userId === userId) {
        return res.status(400).json({ message: "You cannot delete your own account." });
        }

        const deletedUser = await User.findOneAndDelete({ id: userId });

        if (!deletedUser) {
        return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
        console.error("Delete user error:", error);
        res.status(500).json({ message: "Server error." });
  }
}