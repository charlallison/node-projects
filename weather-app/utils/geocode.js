const request = require('request')

const geocode = (address, callback) => {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'
        + address +
        '.json?access_token=pk.eyJ1Ijoic29wcmlueWUiLCJhIjoiY2tmZTF6NW90MDBueTJ0dDlsZDJtY2kxdiJ9.tNaz26dGAv8iNB5loCnkgg&limit=1'

    request({url: url, json: true}, (error, response) => {

        if(error) {
            callback('Unable to connect to geocoding service.', undefined)
        } else if(response.body.features.length === 0) {
            callback('Cannot find location, please try again', undefined)
        } else {
            callback(undefined, {
                latitude: response.body.features[0].center[1],
                longitude: response.body.features[0].center[0],
                location: response.body.features[0].place_name
            })
        }
    })
}

module.exports = geocode