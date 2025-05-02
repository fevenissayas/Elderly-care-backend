import express from "express"
import { verifyToken } from "../middleware/auth.middleware.js"

const taskRouter = express.Router()

taskRouter.post("/addSchedule", verifyToken)
