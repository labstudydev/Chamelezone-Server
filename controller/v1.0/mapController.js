const Map = require('../../service/v1.0/mapService')

exports.mapSearchPlaceByName = function(request, response, next) {
    Map.mapSearchPlaceByName(request, response, next)
}