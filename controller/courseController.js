const Course = require('../service/courseService.js')

exports.courseCreate = function(request, response, next) {
    Course.courseCreate(request, response, next)
}

exports.courseReadAll = function(request, response, next) {
    Course.courseReadAll(request, response, next)
}

exports.courseReadOne = function(request, response, next) {
    Course.courseReadOne(request, response, next)
}

exports.courseListUser = function(request, response, next) {
    Course.courseListUser(request, response, next)
}

exports.courseDelete = function(request, response, next) {
    Course.courseDelete(request, response, next)
}