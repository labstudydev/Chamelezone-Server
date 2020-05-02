const Map    = require('../../service/v1.0/mapService')
const logger = require('../../config/logger')

exports.mapSearchPlaceByName = function(request, response, next) {
    logger.info(`Request Method: ${request.route.stack[0].method} / Request Url: ${request.originalUrl}`)
    Map.mapSearchPlaceByName(request, response, next)
}