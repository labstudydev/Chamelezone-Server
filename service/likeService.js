/* ==================== START modules ==================== */

const { ErrorHandler }      = require('../costomModules/customError')
const isEmpty               = require('../costomModules/valueCheck')
const Like                  = require('../dao/likeDao.js')
const util                  = require('../costomModules/util')

/* ==================== END modules ==================== */

// unlike -> like = like_status: true
// like -> unlike = like_status: false
// (likeNumber is null) == unlike = likeNumber: false
// (likeNumber is not null) == like = likeNumber: likeNumber

exports.likeAddPlace = function(request, response, next) {
    let memberNumber = request.params.memberNumber
    isEmpty('memberNumber', memberNumber)
    
    let placeNumber = request.body.placeNumber
    isEmpty('placeNumber', placeNumber)

    Like.insertLike([placeNumber, memberNumber], function(error, results) {
        if (error) {
            console.log(__filename + ", Like.insertLike() error status code 500 !!!")
            return next(new ErrorHandler(500, error))
        }
        
        results[0] = { likeStatus : true }
        response.status(200).send(results[0])
    })
}

exports.likeCancelPlace = function(request, response, next) {
    let memberNumber = request.params.memberNumber
    isEmpty('memberNumber', memberNumber)

    let placeNumber = request.body.placeNumber
    isEmpty('placeNumber', placeNumber)

    Like.deleteLike([placeNumber, memberNumber], function(error, results) {
        if (error) {
            console.log(__filename + ", Like.deleteLike() error status code 500 !!!")
            return next(new ErrorHandler(500, error))
        }

        results[0] = { likeStatus : false }
        response.status(200).send(results[0])
    })
}

exports.likeReadAllByUser = function(request, response, next) {
    let memberNumber = request.params.memberNumber
    isEmpty('memberNumber', memberNumber)

    Like.selectAllByUserLikes([memberNumber], function(error, results) {
        if (error) {
            console.log(__filename + ", Like.selectAllByUserLikes() error status code 500 !!!")
            return next(new ErrorHandler(500, error))
        }
        
        util.resultStringToArray(results, ['keywordName', 'imageNumber', 'savedImageName'])
        
        results.forEach((item, index, array) => {
            results[index].likeStatus = (results[index].likeNumber == null) ? false : true
        })
        
        if(results.length == 0 || results.length == undefined) {
            response.status(404).send("User likes list does not exist")
        } else {
            response.status(200).send(results)
        }
    })
}