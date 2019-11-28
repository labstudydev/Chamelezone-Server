/* ==================== START modules ==================== */
const User = require('../models/userModels.js');
/* ==================== END modules ==================== */

exports.user_create = function(request, response) {
    var setValues = {
        'email': request.body.email,
        'password': request.body.password,
        'name': request.body.name,
        'nickName': request.body.nickName,
        'phoneNumber': request.body.phoneNumber
    };

    User.createUser(setValues, function(error, user) { 
        if (error) {
            response.send(error);
            
        } else {
            response.send(user);
        }
    });
};

exports.user_detail = function(request, response) {
    let memberNumber = request.params.memberNumber;
    console.log(__filename + " - memberNumber : " + memberNumber);
   
    User.getUserById(memberNumber, function(error, user) {
        if (error) {
            response.send(error);
            
        } else {
            response.send(user);
        }
    });
};

exports.user_login = function(request, response) {
    let email = request.body.email;
    let password = request.body.password;
  
    User.getLogin([email, password], function(error, user) {
        if (error) {
            response.send(error);
            
        } else {
            response.send(user);
        }
    });
};

exports.user_update = function(request, response) {
    let memberNumber = request.params.memberNumber;
    let password = request.body.password;
    let nickName = request.body.nickName;
    let phoneNumber = request.body.phoneNumber;

    User.updateById([password, nickName, phoneNumber, memberNumber], function(error, user) {
        if (error) {
            response.send(error);
            
        } else {
            response.send(user);
        }
    });
};

exports.user_delete = function(request, response) {
    let memberNumber = request.params.memberNumber;
    console.log(__filename + " - memberNumber : " + memberNumber);
   
    User.deleteById(memberNumber, function(error, user) {
        if (error) {
            response.send(error);
            
        } else {
            response.send(user);
        }
    });
};