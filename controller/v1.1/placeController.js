const { ErrorHandler }      = require('../../costomModules/customError')
const Place                 = require('../../service/v1.1/placeService.js')
const util                  = require('../../costomModules/util')
const isEmpty               = require('../../costomModules/valueCheck')

exports.placeCreate = function(request, response, next) {
    const images = request.files
    const setValues = {
        memberNumber, name, address, addressDetail, keywordName, openingTime, phoneNumber, content, latitude, longitude
    } = request.body
    
    const nullValueCheckObject = {
        memberNumber, images, name, address, keywordName, openingTime, phoneNumber, content, latitude, longitude
    }
    isEmpty(nullValueCheckObject)

    let keywordNameArraySize = keywordName.length
    let setKeywordNameValues = new Array(keywordNameArraySize)
    for (i = 0; i < keywordNameArraySize; i++) {
        setKeywordNameValues[i] = new Array(1)
    }

    keywordName.forEach((item, index, array) => {
        setKeywordNameValues[index][0] = item
    })

    let openingTimeString = openingTime.toString()

    let parseLatitude = parseFloat(latitude)
    let parseLongitude = parseFloat(longitude)

    let originalImageName, savedImageName, mimetype, imageSize
    
    let iamgesArraySize = images.length
    let setImagesValues = new Array(iamgesArraySize)
    for (i = 0; i < iamgesArraySize; i++) {
        setImagesValues[i] = new Array(4)
    }

    images.forEach((item, index, array) => {
        originalImageName = array[index] = item.originalname
        savedImageName = array[index] = item.filename
        mimetype = array[index] = item.mimetype
        imageSize = array[index] = item.size
        
        setImagesValues[index][0] = originalImageName
        setImagesValues[index][1] = savedImageName
        setImagesValues[index][2] = mimetype
        setImagesValues[index][3] = imageSize
    })

    Place.createPlace([memberNumber, name, address, addressDetail, setKeywordNameValues, openingTimeString, phoneNumber, content, parseLatitude, parseLongitude, setImagesValues], function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }

        if (results == 400) {
            response.status(400).send("Create place duplicate")
        } else {
            response.status(200).send(results)
        }
    })
}

exports.placeReadOne = function(request, response, next) {
    let memberNumber = request.query.memberNumber
    let placeNumber = request.params.placeNumber
    const nullValueCheckObject = {
        placeNumber
    }
    isEmpty(nullValueCheckObject)

    Place.readOnePlace([placeNumber, memberNumber], function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }
        
        if (results.length == 0 || results.length == undefined) {
            response.status(404).send("Place does not exist" )
        } else {
            util.resultStringToArray(results[0], ['placeKeywordNumber', 'keywordName', 'openingTime', 'imageNumber', 'savedImageName'])
            response.status(200).send(results[0])
        }
    })
}

exports.placeReadAll = function(request, response, next) {
    let memberNumber = request.query.memberNumber
    if (memberNumber == null || memberNumber == undefined) {
        memberNumber = 0
    }

    Place.readAllPlace(memberNumber, function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }
        
        results.forEach((item, index, array) => {
            results[index].likeStatus = (results[index].likeNumber == null) ? false : true
        })
        
        util.resultStringToArray(results, ['keywordName', 'imageNumber', 'savedImageName'])
        response.status(200).send(results)
    })
}

exports.placeDelete = function(request, response, next) {
    let placeNumber = request.params.placeNumber
    let memberNumber = request.body

    const nullValueCheckObject = {
        placeNumber, memberNumber
    }
    isEmpty(nullValueCheckObject)

    Place.deletePlace(placeNumber, function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }

        response.status(200).send(results)
    })
}

exports.placeListUser = function(request, response, next) {
    let memberNumber = request.params.memberNumber
    const nullValueCheckObject = {
        memberNumber
    }
    isEmpty(nullValueCheckObject)

    Place.placeListUser([memberNumber], function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }
        
        if (results.length == 0 || results.length == undefined) {
            response.status(404).send("User place list does not exist" )
        } else {
            util.resultStringToArray(results, ['keywordName', 'imageNumber', 'savedImageName'])
            response.status(200).send(results)
        }
    })
}

exports.placeDuplicateCheck = function(request, response, next) {
    const setValues = {
        name, latitude, longitude
    } = request.query

    const nullValueCheckObject = {
        name, latitude, longitude
    }
    isEmpty(nullValueCheckObject)

    Place.placeDuplicateCheck([name, latitude, longitude], function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }

        if(results.length == 0 || results.length == undefined) {
            results[0] = { status : 200, place_check : "Y", message : "Place is not duplicate"}
            response.status(200).send(results[0])
        } else {
            results[0] = { status : 200, place_check : "N", message : "Place is duplicate"}
            response.status(200).send(results[0])
        }  
    })
}

exports.placeUpdate = function(request, response, next) {
    let placeNumber = request.params.placeNumber
    let images = request.files
    const setValues = {
        memberNumber, address, addressDetail, phoneNumber, content, latitude, longitude, deleteImageNumber
    } = request.body
    
    const nullValueCheckObject = {
        placeNumber, memberNumber, address, phoneNumber, content
    }
    isEmpty(nullValueCheckObject)

    Place.updatePlace([placeNumber, images, memberNumber, address, addressDetail, phoneNumber, content, latitude, longitude, deleteImageNumber], function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error.message))
        }

        if (results == 404) { response.status(404).send('Place does not exist') }
        if (results == 200) { response.status(200).send('Update success !!!') }
        if (results == 'CREATEER NOT MATCH') { response.status(200).send('The creater of the place does not match !!!') }
        if (results == 500) { response.status(500).send('Update fail !!!') }
    })
}

exports.placeKeywordUpdate = function(request, response, next) {
    Place.updatePlaceHasKeyword(request, response, next)
}

exports.placeOpeningTimeUpdate = function(request, response, next) {
    Place.updatePlaceOpeningTime(request, response, next)
}