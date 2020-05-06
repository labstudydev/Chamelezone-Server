const Review                = require('../../service/v1.1/reviewService.js')
const isEmpty               = require('../../costomModules/valueCheck')
const { ErrorHandler }      = require('../../costomModules/customError')
const util                  = require('../../costomModules/util')

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
    
    Review.reviewCreate([placeNumber, memberNumber, content, setImagesValues], function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }

        if(results == 404) {
            response.status(404).send("Create place duplicate")
        } else {
            response.status(200).send(results)
        }
    })
}

exports.reviewReadAll = function(request, response, next) {
    Review.reviewReadAll(function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }
        
        response.status(200).send(results)
    })
}

exports.reviewReadByUser = function(request, response, next) {
    let memberNumber = request.params.memberNumber

    Review.reviewReadByUser([memberNumber], function(error, results) {
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

    Review.reviewReadOneByPlace([placeNumber, reviewNumber], function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }
        
        util.resultStringToArray(results[0], ['imageNumber', 'originalImageName', 'savedImageName'])
        response.status(200).send(results[0])   
    })
}

exports.reviewReadByPlace = function(request, response, next) {
    let placeNumber = request.params.placeNumber

    Review.reviewReadByPlace([placeNumber], function(error, results) {
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
    
    const nullValueCheckObject = {
        placeNumber, reviewNumber, memberNumber
    }
    isEmpty(nullValueCheckObject)

    Review.reviewDelete([memberNumber, placeNumber, reviewNumber], function(error, results) {
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

    Review.reviewUpdate([images, placeNumber, reviewNumber, memberNumber, content, deleteImageNumber], function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }
        if (results == 404) {
            response.status(200).send('Review does not exsit')
        }

        if (results == 200) {
            response.status(200).send('Update success !!!')
        }

        if (results == 500) {
            response.status(500).send('Update fail !!!')
        }

        if (results == 'NOT MATCH') {
            response.status(200).send('The writer of the review does not match')
        }
    })
}