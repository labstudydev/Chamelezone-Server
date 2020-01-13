/* ==================== START modules ==================== */

const Images = require('../service/imagesService.js');

/* ==================== END modules ==================== */

exports.images_getImageFile = function(request, response, next) {
    Images.getImageFile(request, response, next);
}

exports.images_uploadImageFile = function(request, response, next) {
    Images.uploadImageFile(request, response, next);
}