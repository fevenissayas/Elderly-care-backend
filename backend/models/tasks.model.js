import mongoose from "mongoose"

const tasks = mongoose.Schema({


    schedule:{
        type: String, //daily
        required: true
    },

    startTime: {
        type: Date,
    },

    endTime: {
        type: Date,
    },
    
    frequency:{
        type: String,
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
    ref: 'Nurse'
    }
    
})

const Task = mongoose.model('Task', tasks)

export default Task