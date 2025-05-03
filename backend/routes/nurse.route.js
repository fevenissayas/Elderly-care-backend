import express from "express"
import { assignTask,updateProfile, updateUserDetails,getProfile,getUserDetails, getUsers, signup } from "../controllers/nurse.controller.js"
import { verifyToken } from "../middleware/auth.middleware.js"

const nurseRoute = express.Router()

nurseRoute.post("/addTask",verifyToken, assignTask)
nurseRoute.post("/signup", signup)
nurseRoute.get("/",verifyToken, getUsers)
nurseRoute.put("/profile", verifyToken, updateProfile)
nurseRoute.get("/profile", verifyToken, getProfile);
nurseRoute.get("/user/:userId/details",verifyToken, getUserDetails);
nurseRoute.put("/user/:userId/details", verifyToken, updateUserDetails);


export default nurseRoute