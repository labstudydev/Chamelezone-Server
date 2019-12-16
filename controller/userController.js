/* ==================== START modules ==================== */

 const User = require('../service/userService');

/* ==================== END modules ==================== */

exports.user_create = function(request, response, next) {
    User.createUser(request, response, next);
};

exports.user_detail = function(request, response, next) {
    User.getUserById(request, response, next);
};

exports.user_login = function(request, response, next) {
    User.getLogin(request, response, next);

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

exports.user_update = function(request, response, next) {
    User.updateById(request, response, next);
};

exports.user_delete = function(request, response, next) {
    User.deleteById(request, response, next);
};