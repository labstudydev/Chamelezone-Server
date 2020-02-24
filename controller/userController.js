/* ==================== START modules ==================== */

const User = require('../service/userService')

/* ==================== END modules ==================== */

exports.user_create = function(request, response, next) {
    User.createUser(request, response, next)
}

exports.user_detail = function(request, response, next) {
    User.getUserById(request, response, next)
}

exports.user_login = function(request, response, next) {
    User.getLogin(request, response, next)
}

exports.user_update = function(request, response, next) {
    User.updateById(request, response, next)
}

exports.user_delete = function(request, response, next) {
    User.deleteById(request, response, next)
}

exports.userEmailDuplicateCheck = function(request, response, next) {
    User.userEmailDuplicateCheck(request, response, next)
}

exports.userNickNameDuplicateCheck = function(request, response, next) {
    User.userNickNameDuplicateCheck(request, response, next)
}

exports.userEmailFind = function(request, response, next) {
    User.userEmailFind(request, response, next)
}

exports.userSendSecurityCode = function(request, response, next) {
    User.userSendSecurityCode(request, response, next)
}

exports.userPasswordReset = function(request, response, next) {
    User.userPasswordReset(request, response, next)
}
