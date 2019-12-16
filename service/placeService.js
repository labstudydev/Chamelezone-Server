/* ==================== START modules ==================== */

var str2json = require('string-to-json');
const Place = require('../dao/placeDao.js');

/* ==================== END modules ==================== */

exports.createPlace = function(request, response, next) {

    // if(request) {
    //     // response.status(404).send("test");
    //     next(JSON.parse('message: error!!!!!'));
    // }

    const setValues = {
        keywordNumber, name, address, openingTime, phoneNumber, content, latitude, longitude
    } = request.body

    Place.createPlace(setValues, function(error, place) { 
        if (error) {
            // response.send(error);
            // var output = str2json.convert({ "status": "400", "message": "error" });
            // console.log(output)
            error.status = 500;
            error.message = str2json.convert({ "status": 500, "message": error.message });
            next(error);
        }
        
        const result = str2json.convert({ "status": 200, "data": place });
        response.send(result);
    });
};

exports.readOnePlace = function(request, response, next) {
    let placeNumber = request.params.placeNumber;

    Place.readOnePlace(placeNumber, function(error, place) { 
        if (error) {
            response.send(error);
        }
        response.send(place);
    });
};

exports.readAllPlace = function(request, response, next) {
    
    Place.readAllPlace(function(error, place) { 
        if (error) {
            // response.send(error);
            next(error);
        }
        response.send(place);
    });
};

exports.updatePlace = function(request, response, next) {
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

exports.deletePlace = function(request, response, next) {
    let placeNumber = request.params.placeNumber;

    Place.deletePlace(placeNumber, function(error, place) { 
        if (error) {

            response.send(error);
        }
        response.send(place);
    });
};

exports.getCutrrentLocation = function(request, response, next) {
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