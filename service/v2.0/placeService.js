const { ErrorHandler }      = require('../../costomModules/customError')
const Place                 = require('../../dao/v2.0/placeDao.js')
const Like                  = require('../../dao/v2.0/likeDao.js')
const isEmpty               = require('../../costomModules/valueCheck')
const Step					= require('step')
const util                  = require('../../costomModules/util')
  
exports.createPlace = function(request, response, next) {
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
                response.status(400).send("Create place duplicate")
            }

            if (result == true) {
                Place.createPlace([memberNumber, name, address, addressDetail, setKeywordNameValues, openingTimeString, phoneNumber, content, parseLatitude, parseLongitude, setImagesValues], function(error, place) { 
                    if (error) {
                        return next(new ErrorHandler(500, error))
                    }
                    response.status(200).send(place)
                })
            }
        }
    )
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

                    util.resultStringToArray(results[0], ['placeKeywordNumber', 'keywordName', 'openingTime', 'imageNumber', 'savedImageName'])
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

exports.updatePlace = function(request, response, next) {
    let placeNumber = request.params.placeNumber
    let images = request.files
    const setValues = {
        memberNumber, address, addressDetail, phoneNumber, content, latitude, longitude, deleteImageNumber
    } = request.body
    
    const nullValueCheckObject = {
        placeNumber, memberNumber, address, phoneNumber, content
    }
    isEmpty(nullValueCheckObject)
    
    Step (
        function updatePlaceEditMemberCheck() {
            Place.readOnePlace([placeNumber], this)
        },
        function updatePlace(error, result) {
            if (error) {
				throw new ErrorHandler(404, "Place does not exist")
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
                response.status(200).send("The creater of the place does not match")
            }
        },
        function updatePlaceImagesEditMemberCheck(error, result) {
            if (error) {
				throw new ErrorHandler(500, error)
            }

            if (result.affectedRows > 0) {
                Place.selectPlaceImages([placeNumber], this)
            } else {
                response.status(500).send("Place Update error")
            }
        },
        function updatePlaceImages(error, result) {
            if (error) {
                throw new ErrorHandler(404, "Place Image does not exsit")
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
                response.status(200).send('Update success !!!')
            } else {
                response.status(500).send('Update fail !!!')
            }
        }
    )
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