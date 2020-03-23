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

exports.updatePlace = function(request, response, next) {
    let placeNumber = request.params.placeNumber
    const setValues = {
        memberNumber, name, address, openingTime, phoneNumber, content, keywordNumber, placeKeywordNumber
    } = request.body

    const nullValueCheckObject = {
        placeNumber, memberNumber
    }
    isEmpty(nullValueCheckObject)
    
    let openingTimeString = openingTime.toString()
    
    /*
        순차적으로 수정 굳이 query를 실행할 필요 없음
        1. place table 수정
        2. place_keyword 수정
        3. place_images 수정
    */
    Step (
        function placeEditCheck() {
            Place.selectPlaceEditCheck([placeNumber, memberNumber], this)
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
        },  // 수정 가능한 장소인지 확인 여부
        function placeUpdate(error, result) {
            if (error) {
                throw new ErrorHandler(500, error)
            }

            Step (
                /*
                * place table update
                */
                function placeUpdateCheck() {
                    Place.updatePlaceCheck([placeNumber], this)
                },
                function placeUpdateCheckResult(error, result) {
                    if (error) {
                        throw new ErrorHandler(500, error)
                    }
                    setValues.openingTime = openingTimeString
                    delete setValues.memberNumber
                    delete setValues.keywordNumber
                    delete setValues.placeKeywordNumber

                    const setValuesToArray = Object.values(setValues)
                    const resultToArray = Object.values(result[0])
                    
                    console.log("setValuesToArray ", setValuesToArray)
                    console.log("resultToArray ", resultToArray)

                    for (i = 0; i < setValuesToArray.length; i++) {
                        if (setValuesToArray[i] != setValuesToArray[i]) {
                            return false
                        }
                    }
                    return true
                },
                function placeUpdateResult(error, result) {
                    if (error) {
                        throw new ErrorHandler(500, error)
                    }

                    // 값이 변한게 없으면 true
                    // 값이 변한게 있으면 false
                    if (result == false) {
                        Place.updatePlace([name, address, openingTimeString, phoneNumber, content, placeNumber], function(error, results) { 
                            if (error) {
                                return next(new ErrorHandler(500, error))
                            }
                            console.log("place update results: " + results)
                            // response.status(200).send(results)
                        })
                    }
                    return true
                },
                /*
                * place has keyword table update
                */
                function placeHasKeywordUpdateCheck(error, result) {
                    if (error) {
                        throw new ErrorHandler(500, error)
                    }
                    console.log(placeKeywordNumber)
                    Place.updatePlaceHasKeywordCheck([placeKeywordNumber, keywordNumber, placeNumber], this)
                },
                function placeHasKeywordUpdateCheckResult(error, result) {
                    if (error) {
                        throw new ErrorHandler(500, error)
                    }
                    
                    console.log(placeKeywordNumber)
                    console.log(keywordNumber)
                    console.log("=======================================")
                    console.log(result)
                    
                    console.log("=======================================")
                    
                    // body의 키워드 값이 결과 개수랑 변함이 없으면 - 수정 x
                    // 개수의 변함이 없는데 값이 다르면 수정 o
                    if (keywordNumber.length == result.length) {
                        return ture
                    } else {
                        console.log("update ++++++++++++++++++++++++++++++++++++++++++")
                        Place.updatePlaceHasKeyword([keywordNumber, placeKeywordNumber], this)
                    }
                    // body의 키워드 값이 결과 개수 보다 적으면 - delete
                    if (keywordNumber.length < result.length) {
                        console.log("delete ++++++++++++++++++++++++++++++++++++++++++")
                        Place.deletePlaceHasKeyword([placeNumber, keywordNumber], this)
                    }
                    
                    // body의 키워드 값이 결과의 개수 보다 많으면 - insert
                    if (keywordNumber.length > result.length) {
                        console.log("insert ++++++++++++++++++++++++++++++++++++++++++")
                        Place.insertPlaceHasKeyword([placeNumber, keywordNumber], this)
                    }

                    console.log(aaaaaaaaaaaaaaaaaaaaaaaa)
                },
                function placeHasKeywordUpdateResult(error, result) {
                    if (error) {
                        throw new ErrorHandler(500, error)
                    }
                    // 값이 변한게 없으면 true
                    // 값이 변한게 있으면 false
                    if (result == false) {
                        Place.updatePlaceHasKeyword([keywordNumber, placeKeywordNumber], function(error, results) { 
                            if (error) {
                                return next(new ErrorHandler(500, error))
                            }
                            console.log("place update results: " + results)
                            // response.status(200).send(results)
                        })
                    }
                }
            )   // Step()
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
        name, latitude, longitude
    } = request.query
    // let name = requets.query.name
    // let address = requets.query.name

    const nullValueCheckObject = {
        name, latitude, longitude
    }
    isEmpty(nullValueCheckObject)
    
    Place.selectPlaceDuplicateCheck([name, latitude, longitude], function(error, results) {
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
