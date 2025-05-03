import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./config/db.js";
import authroutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import nurseRoute from "./routes/nurse.route.js";

dotenv.config()

const app = express()
app.use(express.json())


app.use('/auth/user', authroutes)
app.use('/nurse', nurseRoute)
app.use('/user', userRoutes)
app.use('/auth', authroutes)

app.listen(8000, () => {
    connectDB();
    console.log("server is listening on port 8000: http://localhost:8000")
})