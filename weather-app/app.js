const geocode = require("./utils/geocode.js")
const forecast = require("./utils/forecast");

if(process.argv[2] !== undefined) {
    const location = process.argv[2]
    geocode(location, (error, res) => {
        if (error) {
            return console.log('error: ' + error)
        }
        // console.log('error: ' + error)
        // console.log('response: ' + JSON.stringify(response))

        forecast(res.latitude, res.longitude, (error, data) => {
            if (error) {
                return console.log('error: ' + error)
            }

            console.log(res.location)
            console.log(data)
        })
    })
} else {
    console.log("Please provide an address.")
}
