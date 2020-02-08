/* ==================== START modules ==================== */

const Review = require('../service/reviewService.js');

/* ==================== END modules ==================== */

exports.reviewCreate = function(request, response, next) {
    Review.reviewCreate(request, response, next)
}

exports.reviewReadAll = function(request, response, next) {
    Review.reviewReadAll(request, response, next)
}

exports.reviewReadByUser = function(request, response, next) {
    Review.reviewReadByUser(request, response, next)
}

exports.reviewReadOneByPlace = function(request, response, next) {
    Review.reviewReadOneByPlace(request, response, next)
}

exports.reviewReadByPlace = function(request, response, next) {
    Review.reviewReadByPlace(request, response, next)
}