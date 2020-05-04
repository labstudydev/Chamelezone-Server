const { ErrorHandler }      = require('../../costomModules/customError')
const isEmpty               = require('../../costomModules/valueCheck')
const Review                = require('../../dao/v1.0/reviewDao.js')
const util                  = require('../../costomModules/util')
const Step					= require('step')
const logger                = require('../../config/logger')

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
    Step (
        function reviewDuplicateCheck() {
            Review.selectReviewDuplicateCheck([memberNumber, placeNumber, content], this)
        },
        function reviewInsert(error, result) {
            if (error) {
				throw new ErrorHandler(500, error)
            }
            
            if(result.length == 0 || result.length == undefined) {
                Review.insertReview([placeNumber, memberNumber, content, setImagesValues], function(error, results) {
                    if (error) {
                        return next(new ErrorHandler(500, error))
                    }
                    response.status(200).send(results)
                })
            } else {
                response.status(400).send("Create place duplicate")
            }
        }
    )
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
    logger.info(`Request Values = memberNumber: ${memberNumber}`)

    Review.selectByUser([memberNumber], function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }
        
        util.resultStringToArray(results, ['imageNumber', 'originalImageName', 'savedImageName'])
        response.status(200).send(results)
    })
}

exports.reviewReadOneByPlace = function(request, response, next) {
    let placeNumber = request.params.placeNumber
    let reviewNumber = request.params.reviewNumber
    logger.info(`Request Values = placeNumber: ${placeNumber} / reviewNumber: ${reviewNumber}`)
    
    Review.selectByReview([placeNumber, reviewNumber], function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }
        
        util.resultStringToArray(results[0], ['imageNumber', 'originalImageName', 'savedImageName'])
        response.status(200).send(results[0])        
    })
}

exports.reviewReadByPlace = function(request, response, next) {
    let placeNumber = request.params.placeNumber
    logger.info(`Request Values = placeNumber: ${placeNumber}`)

    Review.selectByPlace([placeNumber], function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }
        util.resultStringToArray(results, ['imageNumber', 'originalImageName', 'savedImageName'])
        response.status(200).send(results)
    })
}

exports.reviewDelete = function(request, response, next) {
    let memberNumber = request.body.memberNumber
    const setValues = {
        placeNumber, reviewNumber
    } = request.params
    logger.info(`Request Values = setValues: ${setValues} / memberNumber: ${memberNumber}`)
    
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
        memberNumber, content, deleteImageNumber,
    } = request.body
    
    const nullValueCheckObject = {
        placeNumber, reviewNumber, memberNumber, content
    }

    isEmpty(nullValueCheckObject)

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

                    setImagesValues[i].unshift(reviewNumber)
                }
                
                Review.insertReviewImages([setImagesValues], function(error, results) {
                    if (error) { return next(new ErrorHandler(500, error)) }
                    queryResultFlag = (results.affectedRows > 0) ? true : false
                })
            }
            
            if (deleteImageNumber != undefined) {
                Review.deleteReviewImages([reviewNumber, deleteImageNumber], function(error, results) {
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
