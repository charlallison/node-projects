const express = require('express')
const app = express();
const port = process.env.PORT || 3000

// no function is required in the file from mongoose.js but this ensures that the file is loaded
// and the app connects to the database.
require('./db/mongoose')

const User = require('./models/user')
const Task = require('./models/task')

// automatically convert request body to json object
app.use(express.json())

app.post('/users', (req, res) => {
    const user = new User(req.body)

    user.save()
        .then(_ => res.status(201).send(user))
        .catch(error => res.status(500).send({ 'error' : error }))
})

app.get('/users', (req, res) => {
    User.find({})
        .then(result => res.status(200).send(result))
        .catch(error => res.status(500).send({'error': error}))
})

app.get('/users/:id', (req, res) => {
    User.findById(req.params.id)
        .then(result => {
            if(!result) {
                return res.status(404).send({})
            }
            res.status(200).send(result)
        })
        .catch(error => {
            console.log(error)
            res.status(500).send({'error': error})
        })
})

app.post('/tasks', (req, res) => {
    const task = new Task(req.body)

    task.save()
        .then(_ => res.status(201).send(task))
        .catch(_ => res.status(400).send({ 'error' : _ }))
})

app.get('/tasks', (req, res) => {
    Task.find({})
        .then(result => res.status(200).send(result))
        .catch(error => res.status(500).send({'error': error}))
})

app.get('/tasks/:id', (req,res) => {
    Task.findById(req.params.id)
        .then(result => {
            if(!result) {
                return res.status(404).send({})
            }
            res.status(200).send(result)
        })
        .catch(error => res.status(500).send({'error': error}))
})





app.listen(port, _ =>
    console.log(`Server is up on port ${port}`)
)