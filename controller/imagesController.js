/* ==================== START modules ==================== */

const Images = require('../service/imagesService.js');

/* ==================== END modules ==================== */

exports.images_getImageFile = function(request, response, callback) {
    Images.getImageFile(request, response, callback);
}
