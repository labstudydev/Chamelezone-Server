/* ==================== START modules ==================== */

const Review = require('../service/reviewService.js');

/* ==================== END modules ==================== */

exports.reviewCreate = function(request, response, next) {
    Review.reviewCreate(request, response, next)
}

exports.reviewReadAll = function(request, response, next) {
    Review.reviewReadAll(request, response, next)
}
