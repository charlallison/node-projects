const request = require('request')

const forecast =  (latitude, longitude, callback) => {
    const url = `http://api.weatherstack.com/current?access_key=0edca9548dc1b35d7e24af3a318ec570&query=${latitude},${longitude}`//&units=f`

    request({url: url, json: true}, (error, response) => {
        if(error) {
            console.log("Unable to connect to weather service.")
        } else if(response.body.error) {
            console.log('Cannot find location')
            console.log(url)
        } else {
            const current = response.body.current;
            callback(undefined, current.weather_descriptions[0] + ' - It is currently '+ current.temperature + ' degrees out. It feels like '+ current.feelslike + ' degrees out.')
        }
    })
}

module.exports = forecast