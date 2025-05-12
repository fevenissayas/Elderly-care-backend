import express from "express"
import { assignTask,updateProfile, updateUserDetails,getProfile,getUserDetails, getUsers, signup } from "../controllers/nurse.controller.js"
import { verifyToken } from "../middleware/auth.middleware.js"
import { deleteUser } from "../controllers/nurse.controller.js"

const nurseRoute = express.Router()

nurseRoute.post("/addTask/:id",verifyToken, assignTask)
nurseRoute.post('/addTask',verifyToken, assignTask);
nurseRoute.post("/signup", signup)
nurseRoute.get("/",verifyToken, getUsers)
nurseRoute.put("/profile", verifyToken, updateProfile)
nurseRoute.get("/profile", verifyToken, getProfile);
nurseRoute.get("/user/:userId/details",verifyToken, getUserDetails);
nurseRoute.put("/user/:userId/details", verifyToken, updateUserDetails);
nurseRoute.delete("/user/:userId/details/delete", verifyToken, deleteUser)


export default nurseRoute