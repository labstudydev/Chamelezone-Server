/* ==================== START modules ==================== */

const Place = require('../service/placeService.js');

/* ==================== END modules ==================== */

exports.place_create = function(request, response, callback) {
    Place.createPlace(request, response, callback);
};

exports.place_readOne = function(request, response, callback) {
    Place.readOnePlace(request, response, callback);
};

exports.place_readAll = function(request, response, callback) {
    Place.readAllPlace(request, response, callback);
};

exports.place_update = function(request, response, callback) {
    Place.updatePlace(request, response, callback);
};

exports.place_delete = function(request, response, callback) {
    Place.deletePlace(request, response, callback);
};

exports.place_getCutrrentLocation = function(request, response, callback) {
    Place.getCutrrentLocation(request, response, callback);
}

// exports.place_create = function(request, response, callback) {
//     Place.createPlace(placeNumber, function(error, place) { 
//         if (error) {
//             response.send(error);
            
//         } else {
//             response.send(place);
//         }
//     });
//     // var setValues = {
//     //     'keywordNumber' : request.body.keywordNumber,
//     //     'name' : request.body.name,
//     //     'address' : request.body.address,
//     //     'openingTime' : request.body.openingTime,
//     //     'phoneNumber' : request.body.phoneNumber,
//     //     'content' : request.body.content
//     // };
    
//     // Place.createPlace(setValues, function(error, place) { 
//     //     if (error) {
//     //         response.send(error);
            
//     //     } else {
//     //         response.send(place);
//     //     }
//     // });
// };

// exports.place_readOne = function(request, response) {
//     let placeNumber = request.params.placeNumber;

//     Place.readOnePlace(placeNumber, function(error, place) { 
//         if (error) {
//             response.send(error);
            
//         } else {
//             response.send(place);
//         }
//     });
// };

// exports.place_readAll = function(request, response) {
    
//     Place.readAllPlace(function(error, place) { 
//         if (error) {
//             response.send(error);
            
//         } else {
//             response.send(place);
//         }
//     });
// };

// exports.place_update = function(request, response) {
    
//     let name = request.body.name;
//     let address = request.body.address;
//     let openingTime = request.body.openingTime;
//     let phoneNumber = request.body.phoneNumber;
//     let content = request.body.content;
//     let placeNumber = request.params.placeNumber;

//     Place.updatePlace([name, address, openingTime, phoneNumber, content, placeNumber], function(error, place) { 
//         if (error) {
//             response.send(error);
            
//         } else {
//             response.send(place);
//         }
//     });
// };

// exports.place_delete = function(request, response) {
//     let placeNumber = request.params.placeNumber;

//     Place.deletePlace(placeNumber, function(error, place) { 
//         if (error) {
//             response.send(error);
            
//         } else {
//             response.send(place);
//         }
//     });
// };