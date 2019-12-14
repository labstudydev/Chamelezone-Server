/* ==================== START modules ==================== */

const Place = require('../service/placeService.js');

/* ==================== END modules ==================== */

exports.place_create = function(request, response, next) {
    Place.createPlace(request, response, next);
};

exports.place_readOne = function(request, response, next) {
    Place.readOnePlace(request, response, next);
};

exports.place_readAll = function(request, response, next) {
    Place.readAllPlace(request, response, next);
};

exports.place_update = function(request, response, next) {
    Place.updatePlace(request, response, next);
};

exports.place_delete = function(request, response, next) {
    Place.deletePlace(request, response, next);
};

exports.place_getCutrrentLocation = function(request, response, next) {
    Place.getCutrrentLocation(request, response, next);
}

// exports.place_create = function(request, response, next) {
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