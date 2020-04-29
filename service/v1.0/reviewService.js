const { ErrorHandler }      = require('../../costomModules/customError')
const isEmpty               = require('../../costomModules/valueCheck')
const Review                = require('../../dao/v1.0/reviewDao.js')
const util                  = require('../../costomModules/util')
const Step					= require('step')

exports.reviewCreate = function([placeNumber, memberNumber, content, setImagesValues], response, next) { 
    try {
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
                        if (error) { return response(error, null) }
                        response(null, results)
                    })
                } else {
                    return response(null, 404)
                }
            }
        )
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

exports.reviewReadAll = function(response, next) {
    try {
        Review.selectAllReview(function(error, results) {
            if (error) { return response(error, null) }
            response(null, results)
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

exports.reviewReadByUser = function([memberNumber], response, next) {
    try {
        Review.selectByUser([memberNumber], function(error, results) {
            if (error) { return response(error, null) }
            response(null, results)
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

exports.reviewReadOneByPlace = function([placeNumber, reviewNumber], response, next) {
    try {
        Review.selectByReview([placeNumber, reviewNumber], function(error, results) {
            if (error) { return response(error, null) }
            response(null, results)    
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

exports.reviewReadByPlace = function([placeNumber], response, next) {
    try {
        Review.selectByPlace([placeNumber], function(error, results) {
            if (error) { return response(error, null) }
            response(null, results)  
        })
    } catch (error) {
        throw new ErrorHandler(500, error)   
    }
}

exports.reviewDelete = function([memberNumber, placeNumber, reviewNumber], response, next) {
    try {
        Review.deleteReview([memberNumber, placeNumber, reviewNumber], function(error, results) {
            if (error) { return response(error, null) }
            response(null, results) 
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

exports.reviewUpdate = function([images, placeNumber, reviewNumber, memberNumber, content, deleteImageNumber], response, next) {
    try {
        Step (
            function reviewCheck() {
                Review.selectByReview([placeNumber, reviewNumber], this)
            },
            function reviewContentUpdate(error, result) {
                if (error) {
                    throw new ErrorHandler(500, error)
                }

                if (result.length == 0) {
                    return response(null, 404)
                }

                if (result[0].memberNumber != memberNumber) {
                    return response(null, "NOT MATCH")
                } else {
                    Review.updateReview([content, reviewNumber], this)
                }
            },
            function reviewImageCheck(error, result) {
                if (error) {
                    throw new ErrorHandler(500, error)
                }

                if (result.affectedRows > 0) {
                    Review.selectReviewImages([reviewNumber], this)
                } else {
                    return response(null, 500)
                }
            }, function reviewImageUpdate(error, result) {
                if (error) {
                    return response(null, 404)
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
                        if (error) { return response(error, null) }
                        queryResultFlag = (results.affectedRows > 0) ? true : false
                    })
                }
                
                if (deleteImageNumber != undefined) {
                    Review.deleteReviewImages([reviewNumber, deleteImageNumber], function(error, results) {
                        if (error) { return response(error, null) }
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