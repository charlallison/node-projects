const mongoose = require('mongoose')

// create task schema
const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        trim: true,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // must match the name of the Model.
    }
}, {
    timestamps: true
})

// create task model
const Task = mongoose.model('Task', taskSchema)

module.exports = Task