const Place = require('../service/placeService.js')

exports.place_create = function(request, response, next) {
    Place.createPlace(request, response, next)
}

exports.place_readOne = function(request, response, next) {
    Place.readOnePlace(request, response, next)
}

exports.place_readAll = function(request, response, next) {
    Place.readAllPlace(request, response, next)
}

exports.place_update = function(request, response, next) {
    Place.updatePlace(request, response, next)
}

exports.place_delete = function(request, response, next) {
    Place.deletePlace(request, response, next)
}

exports.place_getCutrrentLocation = function(request, response, next) {
    Place.getCutrrentLocation(request, response, next)
}

exports.placeListUser = function(request, response, next) {
    Place.placeListUser(request, response, next)
}

exports.placeDuplicateCheck = function(request, response, next) {
    Place.placeDuplicateCheck(request, response, next)
}

exports.placeKeyword_update = function(request, response, next) {
    Place.updatePlaceHasKeyword(request, response, next)
}

exports.placeOpeningTimeUpdate = function(request, response, next) {
    Place.updatePlaceOpeningTime(request, response, next)
}