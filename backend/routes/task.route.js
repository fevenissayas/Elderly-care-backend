import express from "express"
import { verifyToken } from "../middleware/auth.middleware"

const taskRouter = express.Router()

taskRouter.post("/addSchedule", verifyToken)
