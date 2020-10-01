const mongoose = require('mongoose')
const validator = require('validator')

// create user model
const User = mongoose.model('User', {
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        validate(value) {
            if(value.includes('password')) {
                throw new Error('Password cannot contain the word password')
            }
        }
    },
    email : {
        type: String,
        required: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    age: {
        type: Number,
        validate(value) {
            if(value < 0) {
                throw new Error('Age must be positive number.')
            }
        }
    }
})

module.exports = User