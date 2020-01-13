/* ==================== START modules ==================== */

const str2json = require('string-to-json')
const Place = require('../dao/placeDao.js')
const { ErrorHandler, handleError } = require('../costomModules/customError')
const isEmpty = require('../costomModules/valueCheck')

/* ==================== END modules ==================== */

/* ==================== START function ==================== */

const separator = '|'
function splitString(stringToSplit, separator) {
    var arrayOfStrings = stringToSplit.split(separator)

    arrayOfStrings.forEach(function(element, index){
        console.log(`${index} 번째 요소 : ${element}`)
    })

    return arrayOfStrings
}

/* ==================== END function ==================== */

exports.createPlace = function(request, response, next) {
    const setValues = {
        name, address, keywordName, openingTime, phoneNumber, content, latitude, longitude
    } = request.body

    isEmpty('name', name)
    isEmpty('address', address)
    
    isEmpty('keywordName', keywordName)
    let keywordArray = splitString(keywordName, separator);
    let keyword1 = keywordArray[0]
    let keyword2 = keywordArray[1]
    let keyword3 = keywordArray[2]

    isEmpty('openingTime', openingTime)
    let openingTimeArray = splitString(openingTime, separator);
    let openingTime1 = openingTimeArray[0]
    let openingTime2 = openingTimeArray[1]
    let openingTime3 = openingTimeArray[2]

    isEmpty('phoneNumber', phoneNumber)
    isEmpty('content', content)

    Place.createPlace([name, address, keyword1, keyword2, keyword3, openingTime1, openingTime2, openingTime3, phoneNumber, content], function(error, place) { 
        if (error) {
            console.log(__filename + ", Place.createPlace() error status code 500 !!!")
            return next(new ErrorHandler(500, error))
        }
        response.status(200).send(place)
    })
}

exports.readOnePlace = function(request, response, next) {
    let placeNumber = request.params.placeNumber
    isEmpty(placeNumber)

    Place.readOnePlace(placeNumber, function(error, place) { 
        if (error) {
            console.log(__filename + ", Place.readOnePlace() error status code 500 !!!")
            return next(new ErrorHandler(500, error))
        }
        response.status(200).send(place)
    })
}

exports.readAllPlace = function(request, response, next) {
    
    Place.readAllPlace(function(error, place) { 
        if (error) {
            console.log(__filename + ", Place.readAllPlace() error status code 500 !!!")
            return next(new ErrorHandler(500, error))
        }
        response.status(200).send(place)
    })
}

exports.updatePlace = function(request, response, next) {
    let placeNumber = request.params.placeNumber;
    const setValues = {
        name, address, openingTime, phoneNumber, content
    } = request.body
    
    isEmpty('placeNumber', placeNumber)
    isEmpty('name', name)
    isEmpty('address', address)
    isEmpty('openingTime', openingTime)
    isEmpty('phoneNumber', phoneNumber)
    isEmpty('content', content)

    Place.updatePlace([name, address, openingTime, phoneNumber, content, placeNumber], function(error, place) { 
        if (error) {
            console.log(__filename + ", Place.updatePlace() error status code 500 !!!")
            return next(new ErrorHandler(500, error))
        }
        response.status(200).send(place)
    })
}

exports.deletePlace = function(request, response, next) {
    let placeNumber = request.params.placeNumber;
    isEmpty('placeNumber', placeNumber)

    Place.deletePlace(placeNumber, function(error, place) { 
        if (error) {
            console.log(__filename + ", Place.deletePlace() error status code 500 !!!")
            return next(new ErrorHandler(500, error))
        }
        response.status(200).send(place)
    })
}

exports.getCutrrentLocation = function(request, response, next) {
    const setValues = {
        latitude, longitude, latitude2
    } = request.params

    // [latitude, longitude, latitude2]

    Place.getCutrrentLocation(setValues, function(error, place){
        if (error) {
            console.log(__filename + ", Place.getCutrrentLocation() error status code 500 !!!")
            return next(new ErrorHandler(500, error))
        }
        response.status(200).send(place)
    })
}