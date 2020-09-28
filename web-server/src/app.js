const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const title = 'Weather App'
const author = 'Charles'
const port = 3000

const props = { title, author }

// Define paths for express config
const viewsPath = path.join(__dirname, '../templates/views')
const publicDirPath = path.join(__dirname, '../public')
const partialsPath = path.join(__dirname, '../templates/partials')

// view engine setup
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// set public directory for use of static files
app.use(express.static(publicDirPath))

// setup app routes
app.get('', (req, res) => res.render('index', props))
app.get('/about', (req, res) => res.render('about', props))
app.get('/help', (req, res) => res.render('help', props))

app.get('/weather', (req, res) => {
    const address = req.query.address

    if(!req.query.address) {
        return res.send({error: 'You must provide an address'})
    }

    geocode(req.query.address, (error, {latitude, longitude, location}) => {
        if (error) {
            return res.send({error: error})
        }

        forecast(latitude, longitude, (error, forecast) => {
            if (error) {
                return res.send({error: error})
            }

            res.send({location, forecast, address})
        })
    })
})

//sub pages
app.get('/help/*', (req, res) =>
    res.render('404', {
        errorMessage: 'Help Article not found',
        author, title: '404'
    })
)

// this has to come last given the rendering behaviour of express
app.get('*', (req, res) =>
    res.render('404', {
        errorMessage: 'Page not found',
        author, title: '404'
    })
)

// server start
app.listen(port, _ => console.log(`Server up and running on port ${port}`))