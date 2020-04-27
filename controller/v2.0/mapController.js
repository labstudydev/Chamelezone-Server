const Map = require('../../service/v2.0/mapService')

exports.mapSearchPlaceByName = function(request, response, next) {
    Map.mapSearchPlaceByName(request, response, next)
}