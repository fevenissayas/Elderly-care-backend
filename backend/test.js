import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./config/db.js";
import User from "./models/user.model.js";
import Task from "./models/tasks.model.js";

const run = async () => {
//   await connectDB();

  // 1. Create a new task
  const task = new Task({
    schedule: "daily",
    startDate: new Date(),
    endDate: new Date(new Date().getTime() + 86400000), // +1 day
  });

  await task.save();
  console.log("Task created:", task);

  // 2. Create a new user and assign the task
  const user = new User({
    name: "Test User",
    email: "test@example.com",
    password: "12345678",
    tasks: [task._id],
  });

  await user.save();
  console.log("User created:", user);

  // 3. Populate tasks when fetching user
  const populatedUser = await User.findById(user._id).populate("tasks");
  console.log("User with populated tasks:", populatedUser);

  process.exit(); // exit after test
};

run();
