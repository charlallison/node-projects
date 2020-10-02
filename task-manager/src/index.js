const express = require('express')
const app = express();
const router = express.Router()
const port = process.env.PORT || 3000

// no function is required in the file from mongoose.js but this ensures that the file is loaded
// and the app connects to the database.
require('./db/mongoose')

const User = require('./models/user')
const Task = require('./models/task')

// automatically convert request body to json object
app.use(express.json())

// register router with app.
app.use(router)

app.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        res.status(201).send(user)
    }catch (error) {
        res.status(500).send({ 'error' : error })
    }
})

app.get('/users', async (req, res) => {
    try {
        const result = await User.find({})
        res.status(200).send(result)
    }catch (error) {
        res.status(500).send({'error': error})
    }
})

app.get('/users/:id', async (req, res) => {
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

app.post('/tasks', async (req, res) => {
    const task = new Task(req.body)

    try{
        await task.save()
        res.status(201).send(task)
    }catch (error) {
        res.status(400).send({ 'error' : error })
    }
})

app.get('/tasks', async (req, res) => {
    try {
        const result = await Task.find({})
        res.status(200).send(result)
    }catch (error) {
        res.status(500).send({'error': error})
    }
})

app.get('/tasks/:id', async (req,res) => {
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

app.patch('/users/:id', async (req, res) => {
    let requestFields = Object.keys(req.body)
    let updatableFields = ['name', 'email', 'password', 'age']
    let isUpdateAllowed = requestFields.every(field =>  updatableFields.includes(field))

    if(!isUpdateAllowed){
        return res.status(400).send({message: 'Invalid updates!'})
    }

    try{
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true, useFindAndModify: false
        })
        if(!user) {
            return res.status(404).send({'message': 'user not found'})
        }
        res.status(200).send(user)
    }catch(error) {
        res.status(500).send({'error': error})
    }
})

app.patch('/tasks/:id', async (req, res) => {
    let requestFields = Object.keys(req.body)
    let updatableFields = ['description', 'completed']
    let isUpdateAllowed = requestFields.every(field => updatableFields.includes(field))

    if(!isUpdateAllowed){
        return res.status(400).send({message: 'Invalid updates!'})
    }

    try{
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true, useFindAndModify: false
        })
        if(!task) {
            return res.status(404).send({'message': 'task not found'})
        }
        res.status(200).send(task)
    }catch(error) {
        res.status(500).send({error: error})
    }
})

app.delete('/tasks/:id', async (req, res) => {
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

app.delete('/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)

        if(!task) {
            return res.status(404).send({message: 'user not found'})
        }
        res.status(200).send({})
    }catch (error) {
        res.status(500).send({error: error})
    }
})



app.listen(port, _ =>
    console.log(`Server is up on port ${port}`)
)