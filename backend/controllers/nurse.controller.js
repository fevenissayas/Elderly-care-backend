import Counter from "../models/counter.model.js";
import Nurse from "../models/nurse.model.js";
import Task from "../models/tasks.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const signup = async (req, res) => {


    const nurse = req.body
    if (!nurse.name || !nurse.email || !nurse.password){
        return res.status(400).json({
            message: "Please fill all the fields"
        })
    }
    
    try {
        const email = nurse.email
        const existingnurse = await Nurse.findOne({ email });
        if (existingnurse) {
            return res.status(409).json({ message: "Email is already registered" });
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

        res.status(201).json({ success: true, data: newNurse })

    }catch(error) {
        console.error("Error in nurse.controller:", error.message)
        res.status(500).json({ success: false, message: "server error"})
    }
}

export const getUsers = async (req, res) => {
    try{
        const users = await User.find({}, "name id profileImg email tasks");

        res.status(200).json({users})

    }catch (error){
        res.status(500).json({ message: "Failed to get users", error: error.message });
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
    const assignedBy = req.params.id
    const { schedule,frequency, startTime, endTime, assignedTo } = req.body;

    const task = new Task({ schedule, frequency, startTime, endTime, assignedTo, assignedBy});
    await task.save();


    if (assignedTo) {

        const user = await User.findById(assignedTo);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.tasks.push(task._id);
        await user.save();

        return res.status(200).json({ message: "Task assigned to user" });
    } else {
        const allUsers = await User.find();
        await Promise.all(allUsers.map(user => {
        user.tasks.push(task._id);
        return user.save();
        }));

        return res.status(200).json({ message: "Task assigned to all users" });
    }
};
