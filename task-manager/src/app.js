const express = require('express')
const app = express();

const taskRouter = require('./routers/task')
const userRouter = require('./routers/user')

const port = process.env.PORT

// no function is required in the file from mongoose.js but this ensures that the file is loaded
// and the app connects to the database.
require('./db/mongoose')


// automatically convert request body to json object
app.use(express.json())

// register router with app.
app.use(taskRouter)
app.use(userRouter)

module.exports = app