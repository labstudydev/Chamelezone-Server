const { ErrorHandler }      = require('../../costomModules/customError')
const Like                  = require('../../dao/v1.1/likeDao.js')

/*  unlike -> like = likeStatus: true
    like -> unlike = likeStatus: false
    (likeNumber is null) == unlike = likeStatus: false
    (likeNumber is not null) == like = likeStatus: true */

exports.likeAddPlace = function([placeNumber, memberNumber], response, next) {
    try {
        Like.insertLike([placeNumber, memberNumber], function(error, results) {
            if (error) { return response(error, null) }
            response(null, results)
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

exports.likeCancelPlace = function([placeNumber, memberNumber], response, next) {
    try {
        Like.deleteLike([placeNumber, memberNumber], function(error, results) {
            if (error) { return response(error, null) }
            response(null, results)
        })    
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

exports.likeReadAllByUser = function([memberNumber], response, next) {
    try {
        Like.selectAllByUserLikes([memberNumber], function(error, results) {
            if (error) { return response(error, null) }
            response(null, results)
        })    
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}