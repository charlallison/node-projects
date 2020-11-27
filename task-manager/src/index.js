const express = require('express')
const app = express();
const port = process.env.PORT

const taskRouter = require('./routers/task')
const userRouter = require('./routers/user')

// no function is required in the file from mongoose.js but this ensures that the file is loaded
// and the app connects to the database.
require('./db/mongoose')


// automatically convert request body to json object
app.use(express.json())

// register router with app.
app.use(taskRouter)
app.use(userRouter)

app.listen(port, () =>
    console.log(`Server is up on port ${port}`)
)