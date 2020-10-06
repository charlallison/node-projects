const mongoose = require('mongoose')
const validator = require('validator')
// const bcrypt = require('bcryptjs')
const PASSWORD_SALT = 8;

// create user schema
const schema = new mongoose.Schema( {
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

// this is a middleware for the user model.
// this particular one is run before save is called on a created model.
schema.pre('save', async function(next) {
    const user = this

    if(user.isModified('password')) {
        user.password = bcrypt.hash(user.password, PASSWORD_SALT)
    }

    next()
})
// create user model
const User = mongoose.model('User', schema)

module.exports = User