const { ErrorHandler }      = require('../costomModules/customError')
const isEmpty               = require('../costomModules/valueCheck')
const Review                = require('../dao/reviewDao.js')
const util                  = require('../costomModules/util')

exports.reviewCreate = function(request, response, next) { 
    let placeNumber = request.params.placeNumber
    let images = request.files
    const setValues = {
        memberNumber, content
    } = request.body
    
    isEmpty('images', images[0])
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
    isEmpty('content', content)
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
    const setValues = {
        placeNumber, reviewNumber
    } = request.params
    isEmpty('placeNumber', placeNumber)
    isEmpty('reviewNumber', reviewNumber)
    
    let memberNumber = request.body.memberNumber
    isEmpty('memberNumber', memberNumber)

    Review.deleteReview([memberNumber, placeNumber, reviewNumber], function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }
        response.status(200).send(results)
    })
}