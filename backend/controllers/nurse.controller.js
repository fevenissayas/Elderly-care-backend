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

export const login = async (req, res) => {

    const {email, password} = req.body
    console.log({email, password})

    const nurse = await Nurse.findOne({ email });

    if (!nurse){
        return res.status(400).json({message: "Invalid Email"})
    }

    const matchp = await bcrypt.compare(password, nurse.password)

    if(!matchp){
        return res.status(400).json({message: "Invalid Password"})
    }

    const token = jwt.sign({id: nurse._id, email: nurse.email, role: nurse.role}, process.env.JWT_SECRET,{expiresIn: '24hr'})
    res.status(201).json({message: "Logged in successfully", token })
}



export const getUsers = async (req, res) => {
    try{
        const users = await User.find({}, "name profileImg email tasks");

        res.status(200).json({users})

    }catch (error){
        res.status(500).json({ message: "Failed to get users", error: error.message });
    }
}

export const assignTask = async (req, res) => {
    const assignedBy = req.params.id
    const { schedule, startDate, endDate, assignedTo } = req.body;

    const task = new Task({ schedule, startDate, endDate, assignedTo, assignedBy});
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
