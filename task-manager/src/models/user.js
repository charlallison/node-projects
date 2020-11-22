const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
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
        unique: true,
        trim: true,
        lowercase: true,
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
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

// class method
schema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if(!user) {
        throw new Error('Unable to login')
    }

    const isMatched = await bcrypt.compare(password, user.password)

    if(!isMatched) {
        throw new Error('Unable to login')
    }

    return user
}

schema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

// instance method
schema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'This is the user stuff')
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

// this is a middleware for the user model.
// this particular one is run before save is called on a created model.
schema.pre('save', async function(next) {
    const user = this

    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, PASSWORD_SALT)
    }

    next()
})
// create user model
const User = mongoose.model('User', schema)

module.exports = User