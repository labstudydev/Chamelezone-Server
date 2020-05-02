const Course = require('../../service/v1.0/courseService.js')
const logger = require('../../config/logger')

exports.courseCreate = function(request, response, next) {
    logger.info(`Request Method: ${request.route.stack[0].method} / Request Url: ${request.originalUrl}`)
    Course.courseCreate(request, response, next)
}

exports.courseReadAll = function(request, response, next) {
    logger.info(`Request Method: ${request.route.stack[0].method} / Request Url: ${request.originalUrl}`)
    Course.courseReadAll(request, response, next)
}

exports.courseReadOne = function(request, response, next) {
    logger.info(`Request Method: ${request.route.stack[0].method} / Request Url: ${request.originalUrl}`)
    Course.courseReadOne(request, response, next)
}

exports.courseListUser = function(request, response, next) {
    logger.info(`Request Method: ${request.route.stack[0].method} / Request Url: ${request.originalUrl}`)
    Course.courseListUser(request, response, next)
}

exports.courseDelete = function(request, response, next) {
    logger.info(`Request Method: ${request.route.stack[0].method} / Request Url: ${request.originalUrl}`)
    Course.courseDelete(request, response, next)
}

exports.courseUpdate = function(request, response, next) {
    logger.info(`Request Method: ${request.route.stack[0].method} / Request Url: ${request.originalUrl}`)
    Course.courseUpdate(request, response, next)
}
