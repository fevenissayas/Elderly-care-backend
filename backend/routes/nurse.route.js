import express from "express"
import { getUsers, login, signup } from "../controllers/nurse.controller.js"

const nurseRoute = express.Router()

nurseRoute.post("/signup", signup)
nurseRoute.post("/login", login)
nurseRoute.get("/", getUsers)

export default nurseRoute