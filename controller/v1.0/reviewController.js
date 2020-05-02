const Review = require('../../service/v1.0/reviewService.js')
const logger = require('../../config/logger')

exports.reviewCreate = function(request, response, next) {
    logger.info(`Request Method: ${request.route.stack[0].method} / Request Url: ${request.originalUrl}`)
    Review.reviewCreate(request, response, next)
}

exports.reviewReadAll = function(request, response, next) {
    logger.info(`Request Method: ${request.route.stack[0].method} / Request Url: ${request.originalUrl}`)
    Review.reviewReadAll(request, response, next)
}

exports.reviewReadByUser = function(request, response, next) {
    logger.info(`Request Method: ${request.route.stack[0].method} / Request Url: ${request.originalUrl}`)
    Review.reviewReadByUser(request, response, next)
}

exports.reviewReadOneByPlace = function(request, response, next) {
    logger.info(`Request Method: ${request.route.stack[0].method} / Request Url: ${request.originalUrl}`)
    Review.reviewReadOneByPlace(request, response, next)
}

exports.reviewReadByPlace = function(request, response, next) {
    logger.info(`Request Method: ${request.route.stack[0].method} / Request Url: ${request.originalUrl}`)
    Review.reviewReadByPlace(request, response, next)
}

exports.reviewUpdate = function(request, response, next) {
    logger.info(`Request Method: ${request.route.stack[0].method} / Request Url: ${request.originalUrl}`)
    Review.reviewUpdate(request, response, next)
}

exports.reviewDelete = function(request, response, next) {
    logger.info(`Request Method: ${request.route.stack[0].method} / Request Url: ${request.originalUrl}`)
    Review.reviewDelete(request, response, next)
}
