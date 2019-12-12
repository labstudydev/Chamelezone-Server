/* ==================== START modules ==================== */

const Place = require('../dao/placeDao.js');

/* ==================== END modules ==================== */

exports.createPlace = function(request, response) {
    var setValues = {
        'keywordNumber' : request.body.keywordNumber,
        'name' : request.body.name,
        'address' : request.body.address,
        'openingTime' : request.body.openingTime,
        'phoneNumber' : request.body.phoneNumber,
        'content' : request.body.content,
        'latitude' : request.body.latitude,
        'longitude' : request.body.longitude
    };
    
    Place.createPlace(setValues, function(error, place) { 
        if (error) {
            response.send(error);
        }
        response.send(place);
    });
};

exports.readOnePlace = function(request, response) {
    let placeNumber = request.params.placeNumber;

    Place.readOnePlace(placeNumber, function(error, place) { 
        if (error) {
            response.send(error);
        }
        response.send(place);
    });
};

exports.readAllPlace = function(request, response) {
    
    Place.readAllPlace(function(error, place) { 
        if (error) {
            response.send(error);
        }
        response.send(place);
    });
};

exports.updatePlace = function(request, response) {
    let name = request.body.name;
    let address = request.body.address;
    let openingTime = request.body.openingTime;
    let phoneNumber = request.body.phoneNumber;
    let content = request.body.content;
    let placeNumber = request.params.placeNumber;

    Place.updatePlace([name, address, openingTime, phoneNumber, content, placeNumber], function(error, place) { 
        if (error) {
            response.send(error);
        }
        response.send(place);
    });
};

exports.deletePlace = function(request, response) {
    let placeNumber = request.params.placeNumber;

    Place.deletePlace(placeNumber, function(error, place) { 
        if (error) {
            response.send(error);
        }
        response.send(place);
    });
};

exports.getCutrrentLocation = function(request, response) {
    let latitude = request.params.latitude;
    let longitude = request.params.longitude;
    let latitude2 = request.params.latitude;

    Place.getCutrrentLocation([latitude, longitude, latitude2], function(error, place){
        if (error) {
            response.send(error);
        }
        response.send(place);
    });
};