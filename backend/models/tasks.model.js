import mongoose from "mongoose"

const tasks = mongoose.Schema({


    schedule:{
        type: String, //daily
        required: true
    },

    startDate: {
        type: Date,
    },

    endDate: {
        type: Date,
    },
    

    done: {
        type: Boolean,
        default: false
    },

    assignedTo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }],
    assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
    }
    
})

const Task = mongoose.model('Task', tasks)

export default Task