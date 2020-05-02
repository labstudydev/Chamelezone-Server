const Place  = require('../../service/v1.0/placeService.js')
const logger = require('../../config/logger')

exports.placeCreate = function(request, response, next) {
    logger.info(`Request Method: ${request.route.stack[0].method} / Request Url: ${request.originalUrl}`)
    Place.createPlace(request, response, next)
}

exports.placeReadOne = function(request, response, next) {
    logger.info(`Request Method: ${request.route.stack[0].method} / Request Url: ${request.originalUrl}`)
    Place.readOnePlace(request, response, next)
}

exports.placeReadAll = function(request, response, next) {
    logger.info(`Request Method: ${request.route.stack[0].method} / Request Url: ${request.originalUrl}`)
    Place.readAllPlace(request, response, next)
}

exports.placeUpdate = function(request, response, next) {
    logger.info(`Request Method: ${request.route.stack[0].method} / Request Url: ${request.originalUrl}`)
    Place.updatePlace(request, response, next)
}

exports.placeDelete = function(request, response, next) {
    logger.info(`Request Method: ${request.route.stack[0].method} / Request Url: ${request.originalUrl}`)
    Place.deletePlace(request, response, next)
}

exports.placeGetCutrrentLocation = function(request, response, next) {
    logger.info(`Request Method: ${request.route.stack[0].method} / Request Url: ${request.originalUrl}`)
    Place.getCutrrentLocation(request, response, next)
}

exports.placeListUser = function(request, response, next) {
    logger.info(`Request Method: ${request.route.stack[0].method} / Request Url: ${request.originalUrl}`)
    Place.placeListUser(request, response, next)
}

exports.placeDuplicateCheck = function(request, response, next) {
    logger.info(`Request Method: ${request.route.stack[0].method} / Request Url: ${request.originalUrl}`)
    Place.placeDuplicateCheck(request, response, next)
}

exports.placeKeywordUpdate = function(request, response, next) {
    logger.info(`Request Method: ${request.route.stack[0].method} / Request Url: ${request.originalUrl}`)
    Place.updatePlaceHasKeyword(request, response, next)
}

exports.placeOpeningTimeUpdate = function(request, response, next) {
    logger.info(`Request Method: ${request.route.stack[0].method} / Request Url: ${request.originalUrl}`)
    Place.updatePlaceOpeningTime(request, response, next)
}