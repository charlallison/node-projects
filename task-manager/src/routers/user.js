const express = require('express')
const router = new express.Router()
const User = require('../models/user')


router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        res.status(201).send(user)
    }catch (error) {
        res.status(500).send({ 'error' : error })
    }
})

router.get('/users', async (req, res) => {
    try {
        const result = await User.find({})
        res.status(200).send(result)
    }catch (error) {
        res.status(500).send({'error': error})
    }
})

router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if(!user) {
            return res.status(404).send({})
        }
        res.status(200).send(user)
    }catch (error) {
        res.status(500).send({'error': error})
    }
})

router.patch('/users/:id', async (req, res) => {
    let requestFields = Object.keys(req.body)
    let updatableFields = ['name', 'email', 'password', 'age']
    let isUpdateAllowed = requestFields.every(field =>  updatableFields.includes(field))

    if(!isUpdateAllowed){
        return res.status(400).send({message: 'Invalid updates!'})
    }

    try{
        const user = await User.findById(req.params.id)
        requestFields.forEach(field => user[field] = req.body[field])
        await user.save()

        if(!user) {
            return res.status(404).send({'message': 'user not found'})
        }
        res.status(200).send(user)
    }catch(error) {
        res.status(500).send({'error': error})
    }
})

router.delete('/users/:id', async (req, res) => {
    try {
        let user = await User.findByIdAndDelete(req.params.id)

        if(!user) {
            return res.status(404).send({message: 'user not found'})
        }
        res.status(200).send({})
    }catch (error) {
        res.status(500).send({error: error})
    }
})

module.exports = router