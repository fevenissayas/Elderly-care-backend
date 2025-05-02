import express from "express"
import { assignTask, getUsers, login, signup } from "../controllers/nurse.controller.js"

const nurseRoute = express.Router()

nurseRoute.post("/signup", signup)
nurseRoute.post("/login", login)
nurseRoute.post("/addTask", assignTask)
nurseRoute.get("/", getUsers)

export default nurseRoute