import User from "../models/user.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import Counter from "../models/counter.model.js"
import Nurse from "../models/nurse.model.js"

export const signup = async (req, res) => {

    const user = req.body
    if (!user.name || !user.email || !user.password){
        return res.status(400).json({
            message: "Please fill all the fields",
            success: false
        })
    }
    
    try {
        const email = user.email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email is already registered", success: false });
        }

        const counter = await Counter.findByIdAndUpdate(
            { _id: "userId" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        
        const id = counter.seq.toString().padStart(6, "0");

        const hashedPassword = await bcrypt.hash(user.password, 15);
        const newUser = new User({
            ...user,
            id,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({ success: true, message: "user signed up sucessfully", data: newUser })
    }catch(error){
        console.error("Error in user.controller:", error.message)
        res.status(500).json({ success: false, message: "server error"})
    }

}


export const login = async (req, res) => {
    const { email, password } = req.body;
    console.log({ email, password });
  
    let user = await User.findOne({ email });
    if (!user) {
        user = await Nurse.findOne({ email });
    }
  
    if (!user) {
        return res.status(400).json({ message: "Invalid Email" });
    }
  
    const matchp = await bcrypt.compare(password, user.password);
  
    if (!matchp) {
        return res.status(400).json({ message: "Invalid Password" });
    }
  
    const token = jwt.sign(
        { id: user._id, email: user.email, role: user.constructor.modelName.toLowerCase() },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
  
    res.status(200).json({ message: "Logged in successfully", token ,role: user.role });
  };

export const updateProfile = async (req, res) => {
    const { name,email, caretaker, gender, phoneNo, address } = req.body;
    console.log(req.user)
    const userId = req.user.id;

    try {
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { name,email, caretaker, gender, phoneNo, address },
          { new: true }
        );

        if (!updatedUser) {
          return res.status(404).json({ message: "User not found" });
        }
        
    
        res.status(200).json({ message: "Profile updated", data: updatedUser });
      } catch (error) {
        console.error("Update failed:", error.message);
        res.status(500).json({ message: "Server error" });
      }
};

export const getNurses = async (req, res) => {
    try {
        const nurses = await Nurse.find({}, "name _id email")
        res.status(200).json({nurses})
    }catch(error) {
        res.status(500).json({messgage: "Failed to get Nurses", error: error.message})
    }
}

export const assignNurse = async (req, res) => {
    const userId = req.params.userId
    const {nurseId} = req.body;

    try {
        const nurse = await Nurse.findById(nurseId)
        if (!nurse){
            return res.status(404).json({
                message: "Nurse not Found"
            })
        }

        const user = await User.findById(userId)
        if (!user){
            return res.status(404).json({
                message: "user not Found"
            })
        }

        user.assignedNurse = nurse._id;
        await user.save();

        if (!nurse.users.includes(user._id)) {
            nurse.users.push(user._id);
            await nurse.save();
        }
        
        res.status(200).json({ message: "Nurse assigned successfully", user: updateUser });
    
    } catch (error) {
      res.status(500).json({ message: "Failed to assign nurse", error: error.message });
    }
}  