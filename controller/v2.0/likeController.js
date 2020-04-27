const Like = require('../../service/v2.0/likeService.js')

exports.likeAddPlace = function(request, response, next) {
    Like.likeAddPlace(request, response, next)
}

exports.likeCancelPlace = function(request, response, next) {
    Like.likeCancelPlace(request, response, next)
}

exports.likeReadAllByUser = function(request, response, next) {
    Like.likeReadAllByUser(request, response, next)
}