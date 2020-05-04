const Search = require('../../service/v1.0/searchService')
const logger = require('../../config/logger')

exports.searchByPlaceName = function(request, response, next) {
    logger.info(`Request Method: ${request.method} / Request Url: ${request.originalUrl}`)
    Search.searchByPlaceName(request, response, next)
}

exports.searchByAreaName = function(request, response, next) {
    logger.info(`Request Method: ${request.method} / Request Url: ${request.originalUrl}`)
    Search.searchByAreaName(request, response, next)
}

exports.searchByKeywordName = function(request, response, next) {
    logger.info(`Request Method: ${request.method} / Request Url: ${request.originalUrl}`)
    Search.searchByKeywordName(request, response, next)
}
