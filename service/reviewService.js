const { ErrorHandler }      = require('../costomModules/customError')
const isEmpty               = require('../costomModules/valueCheck')
const Review                = require('../dao/reviewDao.js')
const util                  = require('../costomModules/util')
const Step					= require('../node_modules/step')

exports.reviewCreate = function(request, response, next) { 
    let placeNumber = request.params.placeNumber
    let images = request.files
    const setValues = {
        memberNumber, content
    } = request.body
    
    const nullValueCheckObject = {
        images, content
    }
    isEmpty(nullValueCheckObject)
    console.log("Review create images == ", images)

    // isEmpty('images', images[0])
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

    let parsePlaceNumber = parseInt(placeNumber)

    Review.insertReview([placeNumber, memberNumber, content, setImagesValues], function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }
        response.status(200).send(results)
    })
}

exports.reviewReadAll = function(request, response, next) {
    Review.selectAllReview(function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }
        response.status(200).send(results)
    })
}

exports.reviewReadByUser = function(request, response, next) {
    let memberNumber = request.params.memberNumber

    Review.selectByUser([memberNumber], function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }
        
        // util.resultStringToArray(results, ['imageNumber', 'originalImageName', 'savedImageName'])
        response.status(200).send(results)
    })
}

exports.reviewReadOneByPlace = function(request, response, next) {
    let placeNumber = request.params.placeNumber
    let reviewNumber = request.params.reviewNumber
    
    Review.selectByReview([placeNumber, reviewNumber], function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }
        
        // 선애 test image null 해결되면 그때 살릴것
        // util.resultStringToArray(results[0], ['imageNumber', 'originalImageName', 'savedImageName'])
        response.status(200).send(results[0])        
    })
}

exports.reviewReadByPlace = function(request, response, next) {
    let placeNumber = request.params.placeNumber

    Review.selectByPlace([placeNumber], function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }
        // util.resultStringToArray(results, ['originalImageName', 'savedImageName'])
        response.status(200).send(results)
    })
}

exports.reviewDelete = function(request, response, next) {
    let memberNumber = request.body.memberNumber
    const setValues = {
        placeNumber, reviewNumber
    } = request.params
    
    const nullValueCheckObject = {
        placeNumber, reviewNumber, memberNumber
    }
    isEmpty(nullValueCheckObject)

    Review.deleteReview([memberNumber, placeNumber, reviewNumber], function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }
        response.status(200).send(results)
    })
}

exports.reviewUpdate = function(request, response, next) {
    let images = request.files
    let placeNumber = request.params.placeNumber
    let reviewNumber = request.params.reviewNumber

    const setValues = {
        memberNumber, content, imageNumber
    } = request.body

    const nullValueCheckObject = {
        placeNumber, reviewNumber, memberNumber, content, images
    }
    isEmpty(nullValueCheckObject)
    console.log("Review update ToString == placeNumber: ", placeNumber, ", reviewNumber: ", reviewNumber, ", memberNumber: ", memberNumber, ", content: ", content)

    Step (
        function reviewCheck() {
            Review.selectByReview([placeNumber, reviewNumber], this)
        },
        function reviewContentUpdate(error, result) {
            if (error) {
                throw new ErrorHandler(404, "Review does not exsit")
            }

            if (result[0].memberNumber == memberNumber) {
                Review.updateReview([content, reviewNumber], this)
            } else {
                response.status(200).send("The writer of the review does not match")
            }
        },
        function reviewImageCheck(error, result) {
            if (error) {
                throw new ErrorHandler(500, error)
            }

            if (result.affectedRows > 0) {
                Review.selectReviewImages([reviewNumber], this)
            } else {
                response.status(500).send("Review Update error")
            }
        }, function reviewImageUpdate(error, result) {
            if (error) {
                throw new ErrorHandler(404, "Review does not exsit")
            }

            console.log("images.length : ", images.length, ", result.length : ", result.length)
                        
            let updateFlag, updateCnt
            let originalImageName, savedImageName, mimetype, imageSize
            let imagesArraySize = (images.length > result.length) ? images.length - result.length : 0
            let setImagesValues = new Array(imagesArraySize)

            let deleteImageNumber = new Array()

            if (images.length == result.length) {
                updateFlag = 0
                updateCnt = result.length
            }
            if (images.length > result.length){
                updateFlag = true
                updateCnt = result.length

                for (i = 0; i < imagesArraySize; i++) {
                    setImagesValues[i] = new Array(4)
                }
                for(i = 0; i < images.length - result.length; i++) {
                    originalImageName = images[i+2].originalname
                    savedImageName = images[i+2].filename
                    mimetype = images[i+2].mimetype
                    imageSize = images[i+2].size
                    
                    setImagesValues[i][0] = originalImageName
                    setImagesValues[i][1] = savedImageName
                    setImagesValues[i][2] = mimetype
                    setImagesValues[i][3] = imageSize

                    setImagesValues[i].unshift(reviewNumber)
                }
            }
            if (images.length < result.length) {
                updateFlag = false
                updateCnt = images.length

                for(i = 0; i < result.length; i++) {
                    if (imageNumber[i] != result[i].imageNumber) {
                        deleteImageNumber.push(result[i].imageNumber)
                    }
                }
            }

            for(i = 0; i < updateCnt; i++) {
                Review.updateReviewImages([images[i].originalname, images[i].filename, images[i].mimetype, images[i].size, result[i].reviewNumber, result[i].imageNumber], function(error, results) {
                    if (error) { return next(new ErrorHandler(500, error)) }
                    console.log("Update review success !!!")
                })
            }

            let resultValue = {
                updateFlag,
                reviewNumber,
                setImagesValues,
                deleteImageNumber
            }

            return resultValue
        },
        function reviewImageTransaction(error, result) {
            if (error) {
                throw new ErrorHandler(500, error)
            }

            console.log(result)
            if (result.updateFlag === true) {
                console.log("insert service")
                Review.insertReviewImages([result.setImagesValues], function(error, results) {
                    if (error) { return next(new ErrorHandler(500, error)) }
                    response.status(200).send("Review update success !!!")
                })
            }

            if (result.updateFlag === false) {
                console.log("delete service")
                Review.deleteReviewImages([result.reviewNumber, result.deleteImageNumber], function(error, results) {
                    if (error) { return next(new ErrorHandler(500, error)) }
                    response.status(200).send("Review update success !!!")
                })
            }

            if (result.updateFlag === 0) {
                console.log("Not insert and delete service")
                response.status(200).send("Review update success !!!")
            }
        }
    )
}