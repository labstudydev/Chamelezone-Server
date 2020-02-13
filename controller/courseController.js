/* ==================== START modules ==================== */

const Course = require('../service/courseService.js')

/* ==================== END modules ==================== */

exports.createCourse = function(request, response, next) {
    Course.createCourse(request, response, next)
}