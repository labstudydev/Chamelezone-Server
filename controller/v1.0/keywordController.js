const Keyword = require('../../service/v1.0/keywordService')
const logger  = require('../../config/logger')

exports.keywordReadAll = function(request, response, next) {
    logger.info(`Request Method: ${request.method} / Request Url: ${request.originalUrl}`)
    Keyword.keywordReadAll(request, response, next)
}