const Map = require('../service/mapService')

exports.mapSearchPlaceByName = function(request, response, next) {
    Map.mapSearchPlaceByName(request, response, next)
}