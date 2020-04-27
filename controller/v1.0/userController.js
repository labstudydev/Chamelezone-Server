const User = require('../../service/v1.0/userService')

exports.userCreate = function(request, response, next) {
    User.createUser(request, response, next)
}

exports.userDetail = function(request, response, next) {
    User.getUserById(request, response, next)
}

exports.userLogin = function(request, response, next) {
    User.getLogin(request, response, next)
}

exports.userUpdate = function(request, response, next) {
    User.updateById(request, response, next)
}

exports.userDelete = function(request, response, next) {
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

exports.userCheckSecurityCode = function(request, response, next) {
    User.userCheckSecurityCode(request, response, next)
}

exports.userPasswordReset = function(request, response, next) {
    User.userPasswordReset(request, response, next)
}