import mongoose, { Schema } from "mongoose";

const nurseSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
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
