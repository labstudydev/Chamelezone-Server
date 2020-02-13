/* ==================== START modules ==================== */

const Course = require('../service/courseService.js')

/* ==================== END modules ==================== */

exports.courseCreate = function(request, response, next) {
    Course.courseCreate(request, response, next)
}

exports.courseReadAll = function(request, response, next) {
    Course.courseReadAll(request, response, next)
}