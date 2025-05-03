import mongoose, { Schema } from "mongoose";

const nurseSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  username: {
    type: String,
    required: false,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },
  yearsOfExperience: {
    type: String,
    required: false,
  },

  id: {
    type: String,
    unique: true,
  },

  password: {
    type: String,
    required: true,
    minLength: 6,
  },

  phoneNo: {
    type: String,
    default: "",
  },

  assignedElders: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],

  role: {
    type: String,
    default: "nurse"
  }

}, { timestamps: true });

const Nurse = mongoose.model("Nurse", nurseSchema);

export default Nurse;
