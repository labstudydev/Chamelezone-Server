/* ==================== START modules ==================== */

const User = require('../dao/userDao.js');

/* ==================== END modules ==================== */

exports.createUser = function(request, response) {
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
        }
        response.send(user);
    });
};

exports.getUserById = function(request, response) {
    let memberNumber = request.params.memberNumber;

    User.getUserById(memberNumber, function(error, user) {
        if (error) {
            response.send(error);
        }
        response.send(user);
    });
};

exports.getLogin = function(request, response) {
    let email = request.body.email;
    let password = request.body.password;
  
    User.getLogin([email, password], function(error, user) {
        if (error) {
            response.send(error);
        }
        response.send(user);
    });
};

exports.updateById = function(request, response) {
    let password = request.body.password;
    let nickName = request.body.nickName;
    let phoneNumber = request.body.phoneNumber;
    let memberNumber = request.params.memberNumber;

    User.updateById([password, nickName, phoneNumber, memberNumber], function(error, user) {
        if (error) {
            response.send(error);
        }
        response.send(user);
    });
};

exports.deleteById = function(request, response) {
    let memberNumber = request.params.memberNumber;
   
    User.deleteById(memberNumber, function(error, user) {
        if (error) {
            response.send(error);
        }
        response.send(user);
    });
};