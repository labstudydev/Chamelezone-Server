/* ==================== START modules ==================== */

const Like = require('../service/likeService.js')

/* ==================== END modules ==================== */

exports.likeAddPlace = function(request, response, next) {
    Like.likeAddPlace(request, response, next)
}

exports.likeCancelPlace = function(request, response, next) {
    Like.likeCancelPlace(request, response, next)
}

exports.likeReadAllByUser = function(request, response, next) {
    Like.likeReadAllByUser(request, response, next)
}