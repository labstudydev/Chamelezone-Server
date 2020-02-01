/* ==================== START modules ==================== */

const Map = require('../service/mapService');

/* ==================== END modules ==================== */

exports.mapSearchPlaceByName = function(request, response, next) {
    Map.mapSearchPlaceByName(request, response, next)
}