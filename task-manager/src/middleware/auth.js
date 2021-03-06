const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try{
        let token = req.header('Authorization').replace('Bearer ', '')
        let payload = jwt.verify(token, process.env.JWT_SECRET)

        let user = await User.findOne({_id: payload._id, 'tokens.token': token})

        if(!user) {
            throw new Error("please authenticate")
        }

        req.token = token
        req.user = user;

        next()
    }catch (e) {
        res.status(400).send({message:e.message})
    }
}

module.exports = auth