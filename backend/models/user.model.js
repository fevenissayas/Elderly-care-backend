import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    id: {
        type: String,
        unique: true,
    },

    password: {
        type: String,
        required: true,
        minLength: 6
    },
    
    email: {
        type: String,
        required: true,
        unique: true
    },

    caretaker: {
        type: String,
        default: ""
    }, 

    gender: {
        type: String,
        default: ""

    },

    phoneNo:{
        type: String,
        default: ""
    },

    address:{
        type: String,
        default: ""
    },

    profileImg: {
        type: String,
        default: ""
    },

    tasks: [{
        type: Schema.Types.ObjectId,
        ref: 'Task'
    }],
    role: {
        type: String,
        default: "user"
    },
    assignedNurse: {
        type: Schema.Types.ObjectId,
        ref: 'Nurse'
    }

}, {timestamps: true})

const User = mongoose.model("User", userSchema)

export default User;