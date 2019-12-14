/* ==================== START modules ==================== */
const Place = require('../models/placeModels.js');
/* ==================== END modules ==================== */

exports.place_create = function(request, response) {
    var setValues = {
        'keywordNumber' : request.body.keywordNumber,
        'name' : request.body.name,
        'address' : request.body.address,
        'openingTime' : request.body.openingTime,
        'phoneNumber' : request.body.phoneNumber,
        'content' : request.body.content
    };
    
    Place.createPlace(setValues, function(error, user) { 
        if (error) {
            response.send(error);
            
        } else {
            response.send(user);
        }
    });
};

exports.place_readOne = function(request, response) {
    let placeNumber = request.params.placeNumber;

    Place.readOnePlace(placeNumber, function(error, user) { 
        if (error) {
            response.send(error);
            
        } else {
            response.send(user);
        }
    });
};

exports.place_readAll = function(request, response) {
    
    Place.readAllPlace(function(error, user) { 
        if (error) {
            response.send(error);
            
        } else {
            response.send(user);
        }
    });
};

exports.place_update = function(request, response) {
    
    Place.updatePlace(placeNumber, function(error, user) { 
        if (error) {
            response.send(error);
            
        } else {
            response.send(user);
        }
    });
};

exports.place_delete = function(request, response) {
    let placeNumber = request.params.placeNumber;

    Place.deletePlace(placeNumber, function(error, user) { 
        if (error) {
            response.send(error);
            
        } else {
            response.send(user);
        }
    });
};