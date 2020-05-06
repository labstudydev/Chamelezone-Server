const Like   = require('../../service/v1.0/likeService.js')
const logger = require('../../config/logger')

exports.likeAddPlace = function(request, response, next) {
    logger.info(`Request Method: ${request.method} / Request Url: ${request.originalUrl}`)
    Like.likeAddPlace(request, response, next)
}

exports.likeCancelPlace = function(request, response, next) {
    logger.info(`Request Method: ${request.method} / Request Url: ${request.originalUrl}`)
    Like.likeCancelPlace(request, response, next)
}

exports.likeReadAllByUser = function(request, response, next) {
    logger.info(`Request Method: ${request.method} / Request Url: ${request.originalUrl}`)
    Like.likeReadAllByUser(request, response, next)
}