const express = require('express')
const router = new express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')

router.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        author: req.user._id
    })

    try{
        await task.save()
        res.status(201).send(task)
    }catch (error) {
        res.status(400).send({"message": error.message})
    }
})

router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if(req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'asc' ? 1 : -1
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                // sort: {
                //     createdAt: -1 // sort by createdAt field in a descending order
                // }
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    }catch (error) {
        res.status(500).send({'error': error})
    }
})

router.get('/tasks/:id', auth, async (req,res) => {
    const _id = req.params.id
    const author = req.user._id

    try {
        console.log(_id)
        console.log(req.user._id)
        const result = await Task.findOne({_id, author})
        if(!result) {
            return res.status(404).send()
        }
        res.status(200).send(result)
    }catch (error) {
        res.status(500).send({'error': error})
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    let requestFields = Object.keys(req.body)
    let updatableFields = ['description', 'completed']
    let isUpdateAllowed = requestFields.every(field => updatableFields.includes(field))

    if(!isUpdateAllowed){
        return res.status(400).send({message: 'Invalid updates!'})
    }

    try{
        const task = await Task.findOne({_id: req.params.id, author: req.user._id})

        if(!task) {
            return res.status(404).send({'message': 'task not found'})
        }

        requestFields.forEach(field => task[field] = req.body[field])
        await task.save()

        res.status(200).send(task)
    }catch(error) {
        res.status(500).send(error)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        let task = await Task.findOneAndDelete({_id: req.params.id, author: req.user._id})

        if(!task) {
            return res.status(404).send({message: 'task not found'})
        }
        // task.remove()
        res.status(200).send()
    }catch (error) {
        res.status(500).send({error: error})
    }
})

module.exports = router