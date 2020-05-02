const User              = require('../../service/v1.0/userService')
const logger            = require('../../config/logger')

exports.userCreate = function(request, response, next) {
    logger.info(`Request Method: ${request.route.stack[0].method} / Request Url: ${request.originalUrl}`)
    User.createUser(request, response, next)
}

exports.userDetail = function(request, response, next) {
    logger.info(`Request Method: ${request.route.stack[0].method} / Request Url: ${request.originalUrl}`)
    User.getUserById(request, response, next)
}

exports.userLogin = function(request, response, next) {
    logger.info(`Request Method: ${request.route.stack[0].method} / Request Url: ${request.originalUrl}`)
    User.getLogin(request, response, next)
}

exports.userUpdate = function(request, response, next) {
    logger.info(`Request Method: ${request.route.stack[0].method} / Request Url: ${request.originalUrl}`)
    User.updateById(request, response, next)
}

exports.userDelete = function(request, response, next) {
    logger.info(`Request Method: ${request.route.stack[0].method} / Request Url: ${request.originalUrl}`)
    User.deleteById(request, response, next)
}

exports.userEmailDuplicateCheck = function(request, response, next) {
    logger.info(`Request Method: ${request.route.stack[0].method} / Request Url: ${request.originalUrl}`)
    User.userEmailDuplicateCheck(request, response, next)
}

exports.userNickNameDuplicateCheck = function(request, response, next) {
    logger.info(`Request Method: ${request.route.stack[0].method} / Request Url: ${request.originalUrl}`)
    User.userNickNameDuplicateCheck(request, response, next)
}

exports.userEmailFind = function(request, response, next) {
    logger.info(`Request Method: ${request.route.stack[0].method} / Request Url: ${request.originalUrl}`)
    User.userEmailFind(request, response, next)
}

exports.userSendSecurityCode = function(request, response, next) {
    logger.info(`Request Method: ${request.route.stack[0].method} / Request Url: ${request.originalUrl}`)
    User.userSendSecurityCode(request, response, next)
}

exports.userCheckSecurityCode = function(request, response, next) {
    logger.info(`Request Method: ${request.route.stack[0].method} / Request Url: ${request.originalUrl}`)
    User.userCheckSecurityCode(request, response, next)
}

exports.userPasswordReset = function(request, response, next) {
    logger.info(`Request Method: ${request.route.stack[0].method} / Request Url: ${request.originalUrl}`)
    User.userPasswordReset(request, response, next)
}