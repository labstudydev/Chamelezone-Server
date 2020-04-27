const { ErrorHandler }      = require('../../costomModules/customError')
const isEmpty               = require('../../costomModules/valueCheck')
const Like                  = require('../../dao/likeDao.js')
const util                  = require('../../costomModules/util')

/*  unlike -> like = likeStatus: true
    like -> unlike = likeStatus: false
    (likeNumber is null) == unlike = likeStatus: false
    (likeNumber is not null) == like = likeStatus: true */

exports.likeAddPlace = function(request, response, next) {
    let memberNumber = request.params.memberNumber
    let placeNumber = request.body.placeNumber
    
    const nullValueCheckObject = {
        memberNumber, placeNumber
    }
    isEmpty(nullValueCheckObject)

    Like.insertLike([placeNumber, memberNumber], function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }
        
        results[0] = { likeStatus : true }
        response.status(200).send(results[0])
    })
}

exports.likeCancelPlace = function(request, response, next) {
    let memberNumber = request.params.memberNumber
    let placeNumber = request.body.placeNumber

    const nullValueCheckObject = {
        memberNumber, placeNumber
    }
    isEmpty(nullValueCheckObject)

    Like.deleteLike([placeNumber, memberNumber], function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }

        results[0] = { likeStatus : false }
        response.status(200).send(results[0])
    })
}

exports.likeReadAllByUser = function(request, response, next) {
    let memberNumber = request.params.memberNumber
    const nullValueCheckObject = {
        memberNumber
    }
    isEmpty(nullValueCheckObject)

    Like.selectAllByUserLikes([memberNumber], function(error, results) {
        if (error) {
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