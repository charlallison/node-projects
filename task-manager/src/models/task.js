const mongoose = require('mongoose')
const validator = require('validator')

// create task model
const Task = mongoose.model('Task', {
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
})

module.exports = Task