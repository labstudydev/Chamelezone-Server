/* ==================== START modules ==================== */

const { ErrorHandler }      = require('../costomModules/customError')
const Place                 = require('../dao/placeDao.js')
const isEmpty               = require('../costomModules/valueCheck')

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
    const images = request.files
    const setValues = {
        name, address, keywordName, openingTime, phoneNumber, content, latitude, longitude
    } = request.body
    
    isEmpty('images', images[0])
    isEmpty('name', name)
    isEmpty('address', address)
    
    isEmpty('keywordName', keywordName)
    
    let keywordNameArraySize = keywordName.length
    let setKeywordNameValues = new Array(keywordNameArraySize);
    for (i = 0; i < keywordNameArraySize; i++) {
        setKeywordNameValues[i] = new Array(1);
    }

    keywordName.forEach((item, index, array) => {
        console.log(item)
        setKeywordNameValues[index][0] = item
    })

    isEmpty('openingTime', openingTime)
    let openingTimeArray = splitString(openingTime, separator);
    let openingTime1 = openingTimeArray[0]
    let openingTime2 = openingTimeArray[1]
    let openingTime3 = openingTimeArray[2]

    isEmpty('phoneNumber', phoneNumber)
    isEmpty('content', content)

    isEmpty('latitude', latitude)
    isEmpty('longitude', longitude)
    // var parseLatitude = parseFloat(latitude).toFixed(7)
    // var parseLongitude = parseFloat(longitude).toFixed(7)
    let parseLatitude = parseFloat(latitude)
    let parseLongitude = parseFloat(longitude)

    let originalImageName, savedImageName, mimetype, imageSize
    
    let iamgesArraySize = images.length
    let setImagesValues = new Array(iamgesArraySize);
    for (i = 0; i < iamgesArraySize; i++) {
        setImagesValues[i] = new Array(4);
    }

    images.forEach((item, index, array) => {
        originalImageName = array[index] = item.originalname;
        savedImageName = array[index] = item.filename;
        mimetype = array[index] = item.mimetype;
        imageSize = array[index] = item.size;
        console.log("images toString: " + index + ": " + originalImageName + " || " + savedImageName + " || " + mimetype + " || " + imageSize)
        
        setImagesValues[index][0] = originalImageName
        setImagesValues[index][1] = savedImageName
        setImagesValues[index][2] = mimetype
        setImagesValues[index][3] = imageSize
    })
    
    Place.createPlace([name, address, setKeywordNameValues, openingTime1, openingTime2, openingTime3, phoneNumber, content, parseLatitude, parseLongitude, setImagesValues], function(error, place) { 
        if (error) {
            console.log(__filename + ", Place.createPlace() error status code 500 !!!")
            return next(new ErrorHandler(500, error))
        }
        console.log("Transaction Service Success !!!")
        response.status(200).send(place)
    })
}

exports.readOnePlace = function(request, response, next) {
    let placeNumber = request.params.placeNumber
    isEmpty('placeNumber', placeNumber)

    Place.readOnePlace(placeNumber, function(error, place) { 
        if (error) {
            console.log(__filename + ", Place.readOnePlace() error status code 500 !!!")
            return next(new ErrorHandler(500, error))
        }
        if (place.length == 0 || place.length == undefined) {
            response.status(404).send("Place does not exist" )
        } else {
            response.status(200).send(place[0])
        }
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
        name, address, keywordName, openingTime1, openingTime2, openingTime3, phoneNumber, content
    } = request.body
    
    isEmpty('placeNumber', placeNumber)

    Place.updatePlace([name, address, keywordName, openingTime1, openingTime2, openingTime3, phoneNumber, content, placeNumber], function(error, place) { 
        if (error) {
            console.log(__filename + ", Place.updatePlace() error status code 500 !!!")
            return next(new ErrorHandler(500, error))
        }

        if (place.length == 0 || place.length == undefined) {
            response.status(404).send("Place does not exist" )
        } else {
            response.status(200).send(place)
        }
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