/* ==================== START modules ==================== */

 const User = require('../service/userService');

/* ==================== END modules ==================== */

exports.user_create = function(request, response, callback) {
    User.createUser(request, response, callback);
};

exports.user_detail = function(request, response, callback) {
    User.getUserById(request, response, callback);
};

exports.user_login = function(request, response, callback) {
    User.getLogin(request, response, callback);

    // let email = request.body.email;
    // let password = request.body.password;
  
    // User.getLogin([email, password], function(error, user) {
    //     if (error) {
    //         response.send(error);
            
    //     } else {
    //         response.send(user);
    //     }
    // });
};

exports.user_update = function(request, response, callback) {
    User.updateById(request, response, callback);
};

exports.user_delete = function(request, response, callback) {
    User.deleteById(request, response, callback);
};