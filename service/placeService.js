const { ErrorHandler }      = require('../costomModules/customError')
const Place                 = require('../dao/placeDao.js')
const Like                  = require('../dao/likeDao.js')
const isEmpty               = require('../costomModules/valueCheck')
const Step					= require('../node_modules/step')
const util                  = require('../costomModules/util')

const separator = '|'
function splitString(stringToSplit, separator) {
    var arrayOfStrings = stringToSplit.split(separator)

    arrayOfStrings.forEach(function(element, index){
        console.log(`${index} 번째 요소 : ${element}`)
    })

    return arrayOfStrings
}

exports.createPlace = function(request, response, next) {
    const images = request.files
    const setValues = {
        memberNumber, name, address, keywordName, openingTime, phoneNumber, content, latitude, longitude
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

    Place.createPlace([memberNumber, name, address, setKeywordNameValues, openingTimeString, phoneNumber, content, parseLatitude, parseLongitude, setImagesValues], function(error, place) { 
        if (error) {
            return next(new ErrorHandler(500, error))
        }
        response.status(200).send(place)
    })
}

exports.readOnePlace = function(request, response, next) {
    let memberNumber = request.query.memberNumber
    let placeNumber = request.params.placeNumber
    const nullValueCheckObject = {
        placeNumber
    }
    isEmpty(nullValueCheckObject)

    Step (
        function selectLikeByUser() {
            Like.selectOneByUserLike([placeNumber, memberNumber], this)
        },
        function selectLikeByUserResult(error, result){
            if (error) {
				throw new ErrorHandler(500, error)
            }
            
            if (result[0] == null || result[0] == undefined) {
                return null
            } else {
                return result[0].likeNumber
            }
        },
        function selectPlaceByUser(error, result) {
            if (error) {
				throw new ErrorHandler(500, error)
            }
            Place.readOnePlace(placeNumber, function(error, results) { 
                if (error) {
                    return next(new ErrorHandler(500, error))
                }
        
                if (results.length == 0 || results.length == undefined) {
                    response.status(404).send("Place does not exist" )
                } else {
                    results[0].likeStatus = (result == null) ? false : true

                    util.resultStringToArray(results[0], ['keywordName', 'openingTime', 'imageNumber', 'savedImageName'])
                    response.status(200).send(results[0])
                }
            })
        }
    )
}

exports.readAllPlace = function(request, response, next) {
    let memberNumber = request.query.memberNumber

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

exports.updatePlace = function(request, response, next) {
    let placeNumber = request.params.placeNumber
    let images = request.files
    const setValues = {
        memberNumber, name, address, keywordName, openingTime1, openingTime2, openingTime3, phoneNumber, content
    } = request.body
    
    const nullValueCheckObject = {
        placeNumber, memberNumber
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

    /*
        1. 회원의 번호와 장소의 번호가 일치하는지 확인
        2. 장소의 값 수정
    */
    Step (
        function placeEditCheck() {
            Place.selectPlaceEditCheck([memberNumber, name], this)
        },
        function placeEditCheckResult(error, result) {
            if (error) {
				throw new ErrorHandler(500, error)
            }

            if (result[0] == null || result[0] == undefined) {
                response.status(404).send("Place does not exist")
            } else {
                return result[0]
            }
        },
        function placeUpdate(error, result) {
            if (error) {
				throw new ErrorHandler(500, error)
            }

            Place.updatePlace([setImagesValues, setKeywordNameValues, name, address, openingTime1, openingTime2, openingTime3, phoneNumber, content, placeNumber], function(error, results) { 
                if (error) {
                    return next(new ErrorHandler(500, error))
                }
                response.status(200).send(results)
            })
        }
    )
}

exports.deletePlace = function(request, response, next) {
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

exports.getCutrrentLocation = function(request, response, next) {
    const setValues = {
        latitude, longitude, latitude2
    } = request.params

    Place.getCutrrentLocation(setValues, function(error, results){
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
    
    Place.selectAllByUser([memberNumber], function(error, results) {
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
        name, address
    } = request.query
    // let name = requets.query.name
    // let address = requets.query.name

    const nullValueCheckObject = {
        name, address
    }
    isEmpty(nullValueCheckObject)
    
    Place.selectPlaceDuplicateCheck([name, address], function(error, results) {
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