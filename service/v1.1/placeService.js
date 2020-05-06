const { ErrorHandler }      = require('../../costomModules/customError')
const Place                 = require('../../dao/v1.1/placeDao.js')
const Like                  = require('../../dao/v1.1/likeDao.js')
const isEmpty               = require('../../costomModules/valueCheck')
const Step					= require('step')
const util                  = require('../../costomModules/util')
  
exports.createPlace = function([memberNumber, name, address, addressDetail, setKeywordNameValues, openingTimeString, phoneNumber, content, parseLatitude, parseLongitude, setImagesValues], response, next) {
    try {
        Step (
            function placeDuplicateCheck() {
                Place.selectPlaceDuplicateCheck([name, latitude, longitude], this)
            },
            function placeDuplcateCheckResult(error, result) {
                if (error) {
                    throw new ErrorHandler(500, error)
                }
    
                if(result.length == 0 || result.length == undefined) {
                    return true
                } else {
                    return false
                }
            },
            function createPlace(error, result) {
                if (error) {
                    throw new ErrorHandler(500, error)
                }
    
                if (result == false) {
                    return response(null, 400)
                }
    
                if (result == true) {
                    Place.createPlace([memberNumber, name, address, addressDetail, setKeywordNameValues, openingTimeString, phoneNumber, content, parseLatitude, parseLongitude, setImagesValues], function(error, results) { 
                        if (error) { return response(error, null) }
                        response(null, results)
                    })
                }
            }
        )
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

exports.readOnePlace = function([placeNumber, memberNumber], response, next) {
    try {
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
                    if (error) { return response(error, null) }
                    results[0].likeStatus = (result == null) ? false : true
                    response(null, results)
                })
            }
        )   
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

exports.readAllPlace = function(memberNumber, response, next) {
    try {
        Place.readAllPlace(memberNumber, function(error, results) { 
            if (error) { return response(error, null) }
            response(null, results)
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

exports.deletePlace = function(placeNumber, response, next) {
    try {
        Place.deletePlace(placeNumber, function(error, results) { 
            if (error) { return response(error, null) }
            response(null, results)
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

exports.placeListUser = function([memberNumber], response, next) {
    try {
        Place.selectAllByUser([memberNumber], function(error, results) {
            if (error) { return response(error, null) }
            response(null, results)
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

exports.placeDuplicateCheck = function([name, latitude, longitude], response, next) {
    try {
        Place.selectPlaceDuplicateCheck([name, latitude, longitude], function(error, results) {
            if (error) { return response(error, null) }
            response(null, results)
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

exports.updatePlace = function([placeNumber, images, memberNumber, address, addressDetail, phoneNumber, content, latitude, longitude, deleteImageNumber], response, next) {
    try {
        Step (
            function updatePlaceEditMemberCheck() {
                Place.readOnePlace([placeNumber], this)
            },
            function updatePlace(error, result) {
                if(error) {
                    throw new ErrorHandler(500, error)
                }
    
                if (result.length == 0) {
                    return response(null, 404)
                }
    
                if (result[0].memberNumber == memberNumber) {
                    address = (address == result[0].address) ? result[0].address : address
                    addressDetail = (addressDetail == result[0].addressDetail) ? result[0].addressDetail : addressDetail
                    phoneNumber = (phoneNumber == result[0].phoneNumber) ? result[0].phoneNumber : phoneNumber
                    content = (content == result[0].content) ? result[0].content : content
                    latitude = (latitude == result[0].latitude) ? result[0].latitude : latitude
                    longitude = (longitude == result[0].longitude) ? result[0].longitude : longitude
    
                    let parseLatitude = parseFloat(latitude)
                    let parseLongitude = parseFloat(longitude)
                    
                    Place.updatePlace([address, addressDetail, phoneNumber, content, parseLatitude, parseLongitude, placeNumber, memberNumber], this)
                } else {
                    return response(error, 'CREATEER NOT MATCH')
                }
            },
            function updatePlaceImagesEditMemberCheck(error, result) {
                if (error) {
                    throw new ErrorHandler(500, error)
                }
    
                if (result.affectedRows > 0) {
                    Place.selectPlaceImages([placeNumber], this)
                } else {
                    return response(null, 500)
                }
            },
            function updatePlaceImages(error, result) {
                if (error) {
                    throw new ErrorHandler(500, error)
                }
    
                let queryResultFlag = true
                
                if (images.length > 0) {
                    let originalImageName, savedImageName, mimetype, imageSize
                    let imagesArraySize = (images != undefined) ? images.length : 0
                    let setImagesValues = new Array(imagesArraySize)
    
                    for(i = 0; i < imagesArraySize; i++) {
                        setImagesValues[i] = new Array(4)
                    }
    
                    for(i = 0; i < imagesArraySize; i++) {
                        originalImageName = images[i].originalname
                        savedImageName = images[i].filename
                        mimetype = images[i].mimetype
                        imageSize = images[i].size
                        
                        setImagesValues[i][0] = originalImageName
                        setImagesValues[i][1] = savedImageName
                        setImagesValues[i][2] = mimetype
                        setImagesValues[i][3] = imageSize
    
                        setImagesValues[i].unshift(placeNumber)
                    }
                    
                    Place.insertPlaceImages([setImagesValues], function(error, results) {
                        if (error) { return next(new ErrorHandler(500, error)) }
                        queryResultFlag = (results.affectedRows > 0) ? true : false
                    })
                }
    
                if (deleteImageNumber != undefined) {
                    Place.deletePlaceImages([placeNumber, deleteImageNumber], function(error, results) {
                        if (error) { return next(new ErrorHandler(500, error)) }
                        queryResultFlag = (results.affectedRows > 0) ? true : false
                    })
                }
    
                return queryResultFlag
            },
            function queryResults(error, result) {
                if (error) {
                    throw new ErrorHandler(500, error)
                }
    
                if (result == true) {
                    return response(null, 200)
                } else {
                    return response(null, 500)
                }
            }
        )
    } catch (error) {   
        throw new ErrorHandler(500, error)
    }
}

exports.updatePlaceHasKeyword = function(request, response, next) {
    let placeNumber = request.params.placeNumber
    const setValues = { keywordName, placeKeywordNumber } = request.body
    const nullValueCheckObject = { placeNumber, keywordName }
    isEmpty(nullValueCheckObject)

    Step (
        function updatePlaceHasKeywordCheck() {
            Place.selectPlaceHasKeyword([placeNumber], this)
        },
        function updatePlaceHasKeywordEdit(error, result) {
            if (error) {
                throw new ErrorHandler(404, 'Place Has Keyword does not exsit')
            }
            
            let updateFlag, updateCnt
            let keywordNameArraySize = (keywordName.length > result.length) ? keywordName.length - result.length : 0
            let setKeywordNameValues = new Array(keywordNameArraySize)

            let keywordNumberList = new Array()
            let deleteKeywordList = new Array()
            if (keywordName.length == result.length) {
                updateFlag = 0
                updateCnt = result.length
            }
            if (keywordName.length > result.length){
                updateFlag = true
                updateCnt = result.length

                for (i = 0; i < keywordNameArraySize; i++) {
                    setKeywordNameValues[i] = new Array(1)
                }
                
                for (i = 0; i < keywordName.length - result.length; i++) {
                    setKeywordNameValues[i][0] = keywordName[result.length + i]
                    setKeywordNameValues[i].unshift(placeNumber)
                }
            }

            if (keywordName.length < result.length) {
                updateFlag = false
                updateCnt = keywordName.length                 
                
                keywordNumberList = result.map((target) => target['placeKeywordNumber'].toString())
                deleteKeywordList = keywordNumberList.filter((target) => !placeKeywordNumber.includes(target))
            }

            for(i = 0; i < updateCnt; i++) {
                Place.updatePlaceHasKeyword([keywordName[i], placeKeywordNumber[i], placeNumber], function(error, results) {
                    if (error) { return next(new ErrorHandler(500, error)) }
                })
            }
                
            let resultValue = {
                updateFlag,
                placeNumber,
                setKeywordNameValues,
                deleteKeywordList
            }

            return resultValue
        },
        function updatePlaceHasKeywordResult(error, result) {
            if (error) {
                throw new ErrorHandler(500, error)
            }

            if (result.updateFlag === true) {
                Place.insertPlaceHasKeyowrd([result.setKeywordNameValues], function(error, results) {
                    if (error) { return next(new ErrorHandler(500, error)) }
                    response.status(200).send("Place update success !!!")
                })
            }

            if (result.updateFlag === false) {
                Place.deletePlaceHasKeyowrd([result.placeNumber, result.deleteKeywordList], function(error, results) {
                    if (error) { return next(new ErrorHandler(500, error)) }
                    response.status(200).send("Place update success !!!")
                })
            }

            if (result.updateFlag === 0) {
                response.status(200).send("Place_Has_Keyword update success !!!")
            }
        }
    )
}

exports.updatePlaceOpeningTime = function(request,response, next) {
    let placeNumber = request.params.placeNumber
    const setValues = { openingTime } = request.body
    const nullValueCheckObject = { openingTime }
    isEmpty(nullValueCheckObject)

    Step (
        function updatePlaceOpeningTimeCheck() {
            Place.selectPlaceOpeningTime([placeNumber], this)
        },
        function updatePlaceOpeningTimeEdit(error, result) {
            if(error) {
                throw new ErrorHandler(404, 'Place opeingTime does not exsit')
            }

            let openingTimeString = openingTime.toString()
            openingTimeString = (openingTimeString == result[0].openingTime) ? result[0].phoneNumber : openingTimeString
            
            Place.updatePlaceOpeningTime([openingTimeString, placeNumber], function(error, results) {
                if (error) { return next(new ErrorHandler(500, error)) }
                response.status(200).send("Place update success !!!")
            })
        }
    )
}