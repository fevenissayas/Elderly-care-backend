import Counter from "../models/counter.model.js";
import Nurse from "../models/nurse.model.js";

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
        if (existingUser) {
            return res.status(409).json({ message: "Email is already registered" });
        }

        const counter = await Counter.findByIdAndUpdate(
            { _id: "nurseId" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        
        const id = counter.seq.toString().padStart(6, "0");

        const hashedPassword = await bcrypt.hash(user.password, 15);
        const newNurse = new Nurse({
            ...nurse,
            id,
            password: hashedPassword
        });

        await newNurse.save();

        res.status(201).json({ success: true, data: newNurse })

    }catch(error) {
        console.error("Error in user.controller:", error.message)
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

    const token = jwt.sign({id: nurse._id, email: nurse.email, role: nurse.role}, process.env.JWT_SECRET,{expiresIn: '1h'})
    res.status(201).json({message: "Logged in successfully", token })
}



export const getUsers = async (req, res) => {
    try{
        const users = await User.find({}, "name profileImg email");

        res.status(200).json({users})

    }catch (error){
        res.status(500).json({ message: "Failed to get users", error: error.message });
    }
}