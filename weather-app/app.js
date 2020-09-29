const geocode = require("./utils/geocode.js")
const forecast = require("./utils/forecast");

if(process.argv[2] !== undefined) {
    let location = process.argv[2]
    geocode(location, (error, {latitude, longitude, location}) => {
        if (error) {
            return console.log('error: ' + error)
        }

        forecast(latitude, longitude, (error, data) => {
            if (error) {
                return console.log('error: ' + error)
            }

            console.log(location)
            console.log(data)
        })
    })
} else {
    console.log("Please provide an address.")
}
