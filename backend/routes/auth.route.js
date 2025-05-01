import express from "express"
import { login, signup, updateProfile } from "../controllers/user.controller.js"
import { verifyToken } from "../middleware/auth.middleware.js"

const authroutes = express.Router()

authroutes.post('/signup',signup)
authroutes.post('/login', login)

export default authroutes