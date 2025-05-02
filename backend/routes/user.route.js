import express from "express"
import { verifyToken } from "../middleware/auth.middleware.js"
import { assignNurse, updateProfile } from "../controllers/user.controller.js"
import { tasks } from "../controllers/task.controller.js"


const userRoutes = express.Router()
userRoutes.put("/profile", verifyToken, updateProfile)
userRoutes.get("/tasks", verifyToken,tasks)
userRoutes.put("/assign-nurse",verifyToken, assignNurse)

export default userRoutes