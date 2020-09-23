const request = require('request')

const url = "http://api.weatherstack.com/current?access_key=0edca9548dc1b35d7e24af3a318ec570&query=37.8267,-122.4233&units=f"

request({url:url, json:true}, (error, response) => {
    // const jsonData = JSON.parse(response.body)

    // console.log(response.body.current)
    const current = response.body.current;
    console.log(current.weather_descriptions[0] + '- It is currently '+ current.temperature + ' degrees out. It feels like '+ current.feelslike + ' degrees out.')
})

// Geocoding
// Address 

// using api.mapbox
const geocodeURL = "https://api.mapbox.com/geocoding/v5/mapbox.places/Los%20Angeles.json?access_token=pk.eyJ1Ijoic29wcmlueWUiLCJhIjoiY2tmZTF6NW90MDBueTJ0dDlsZDJtY2kxdiJ9.tNaz26dGAv8iNB5loCnkgg&limit=1"

request({url: geocodeURL, json:true}, (err, res) => {
    // console.log(res.body)
    console.log('Lat: ' + res.body.features[0].center[1])
    console.log('Long: ' + res.body.features[0].center[0])
})