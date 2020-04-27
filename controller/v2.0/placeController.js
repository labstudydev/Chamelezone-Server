const Place = require('../../service/v2.0/placeService.js')

exports.placeCreate = function(request, response, next) {
    Place.createPlace(request, response, next)
}

exports.placeReadOne = function(request, response, next) {
    Place.readOnePlace(request, response, next)
}

exports.placeReadAll = function(request, response, next) {
    Place.readAllPlace(request, response, next)
}

exports.placeUpdate = function(request, response, next) {
    Place.updatePlace(request, response, next)
}

exports.placeDelete = function(request, response, next) {
    Place.deletePlace(request, response, next)
}

exports.placeGetCutrrentLocation = function(request, response, next) {
    Place.getCutrrentLocation(request, response, next)
}

exports.placeListUser = function(request, response, next) {
    Place.placeListUser(request, response, next)
}

exports.placeDuplicateCheck = function(request, response, next) {
    Place.placeDuplicateCheck(request, response, next)
}

exports.placeKeywordUpdate = function(request, response, next) {
    Place.updatePlaceHasKeyword(request, response, next)
}

exports.placeOpeningTimeUpdate = function(request, response, next) {
    Place.updatePlaceOpeningTime(request, response, next)
}