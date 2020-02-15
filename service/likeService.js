/* ==================== START modules ==================== */

const { ErrorHandler }      = require('../costomModules/customError')
const isEmpty               = require('../costomModules/valueCheck')
const Like                = require('../dao/likeDao.js')
const util                  = require('../costomModules/util')

/* ==================== END modules ==================== */

exports.likeAddPlace = function(request, response, next) {
    let memberNumber = request.params.memberNumber
    isEmpty('memberNumber', memberNumber)
    
    let placeNumber = request.body.placeNumber
    isEmpty('placeNumber', placeNumber)

    Like.insertLike([memberNumber, placeNumber], function(error, results) {
        if (error) {
            console.log(__filename + ", Like.insertLike() error status code 500 !!!")
            return next(new ErrorHandler(500, error))
        }
        response.status(200).send(results)
    })
}

exports.likeCancelPlace = function(request, response, next) {
    let likeNumber = request.body.likeNumber
    isEmpty('likeNumber', likeNumber)

    let memberNumber = request.params.memberNumber
    isEmpty('memberNumber', memberNumber)

    let placeNumber = request.body.placeNumber
    isEmpty('placeNumber', placeNumber)

    Like.deleteLike([likeNumber, memberNumber, placeNumber], function(error, results) {
        if (error) {
            console.log(__filename + ", Like.deleteLike() error status code 500 !!!")
            return next(new ErrorHandler(500, error))
        }
        response.status(200).send(results)
    })
}