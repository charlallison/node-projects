const express = require('express')
const router = new express.Router()
const Task = require('../models/task')

router.post('/tasks', async (req, res) => {
    const task = new Task(req.body)

    try{
        await task.save()
        res.status(201).send(task)
    }catch (error) {
        res.status(400).send({ 'error' : error })
    }
})

router.get('/tasks', async (req, res) => {
    try {
        const result = await Task.find({})
        res.status(200).send(result)
    }catch (error) {
        res.status(500).send({'error': error})
    }
})

router.get('/tasks/:id', async (req,res) => {
    try {
        const result = await Task.findById(req.params.id)
        if(!result) {
            return res.status(404).send({})
        }
        res.status(200).send(result)
    }catch (error) {
        res.status(500).send({'error': error})
    }
})

router.patch('/tasks/:id', async (req, res) => {
    let requestFields = Object.keys(req.body)
    let updatableFields = ['description', 'completed']
    let isUpdateAllowed = requestFields.every(field => updatableFields.includes(field))

    if(!isUpdateAllowed){
        return res.status(400).send({message: 'Invalid updates!'})
    }

    try{
        const task = await Task.findById(req.params.id)
        requestFields.forEach(field => task[field] = req.body[field])
        await task.save()

        if(!task) {
            return res.status(404).send({'message': 'task not found'})
        }
        res.status(200).send(task)
    }catch(error) {
        res.status(500).send(error)
    }
})

router.delete('/tasks/:id', async (req, res) => {
    try {
        let task = await Task.findByIdAndDelete(req.params.id)

        if(!task) {
            return res.status(404).send({message: 'task not found'})
        }
        res.status(200).send({})
    }catch (error) {
        res.status(500).send({error: error})
    }
})

module.exports = router