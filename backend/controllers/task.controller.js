import User from "../models/user.model.js"

export const tasks = async (req, res) => {

    const userId = req.user._id
    try {
        const user = await User.findById(userId).populate("tasks")
        if (!user) {
            return res.status(404).json({ message: "User not found" });
          }

        res.status(200).json({ tasks: user.tasks });
    }catch(error) {
        console.log("Error fetching tasks ", error.message)
        res.status(500).json({message: "Server error"})
    }

  }