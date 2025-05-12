import express from "express"
import { verifyToken } from "../middleware/auth.middleware.js"
import { assignNurse, getNurses, updateProfile } from "../controllers/user.controller.js"
import { tasks } from "../controllers/task.controller.js"
import { getProfile } from "../controllers/user.controller.js"

const userRoutes = express.Router()
userRoutes.put("/profile", verifyToken, updateProfile)
userRoutes.get("/profile", verifyToken, getProfile)
userRoutes.get("/tasks", verifyToken,tasks)
userRoutes.get("/nurse", getNurses)
userRoutes.put("/assign-nurse",verifyToken, assignNurse)

export default userRoutes