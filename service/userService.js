/* ==================== START modules ==================== */

const str2json = require('string-to-json');
const User = require('../dao/userDao.js');
const errorMessage = require("../error.js")
const errorHandler2   = require('../error')

/* ==================== END modules ==================== */

exports.createUser = function(request, response, next) {
    console.log("#######################################################################")
    var error = new Error("Not Found")

    let setValues = {
        email, password, name, nickName, phoneNumber
    } = request.body

    if(!email) {
        console.log("email : " + email);
        error.status = 400
        error.message = str2json.convert({"status": 400, "message": error.message})
        throw error
        console.log("이메일 에러!!")
    }


    if(!password) {
        console.log("password is null")
        error.status = 400
        next(error)
        response.status(error.status).end(error.message + "이건가??")
        console.log("너무시하는거야?")

        if(password.length < 10 || password.length > 20) {
            console.log("password : " + password + ", password size : " + password.length)
            error.status = 400
            next(error)
            response.status(error.status).end(error.message + "이건가2222222??")
            console.log("너무시하는거야?")  
        }
    }

    // if(!password || password.length < 10 || password.length > 20) {
    //     console.log("password : " + password + ", password size : " + password.length)
    //     error.status = 400
    //     error.message = str2json.convert({"status": 400, "message": error.message})
    //     console.log("#########################")
    //     console.log(error + "%%%%%%%%%%")
    //     next(error)
    //     console.log(error)
    //     console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
    // }

    try {
        User.createUser(setValues, function(error, user) { 
            if (error) {
                error.status = 500
                error.message = str2json.convert({"status":500, "message": error.message})
                response.send(error)
            }
            const result = str2json.convert({"status": 200, "data": user})
            response.send(result)
        });
    } catch (error) {
        error.status = 500
        error.message = str2json.convert({"status": 500, "message": error.message})
        response.send(error)
    }
};

exports.getUserById = function(request, response, next) {
    let memberNumber = request.params.memberNumber;

    if(!memberNumber) {
        console.log("memberNumber : " + memberNumber);
        error.status = 400
        error.message = str2json.convert({"status": 400, "message": error.message})
        response.send(error)
    }

    User.getUserById(memberNumber, function(error, user) {
        if (error) {
            response.send(error);
        }
        response.send(user);
    });
};

exports.getLogin = function(request, response, next) {
    let email = request.body.email;
    let password = request.body.password;
  
    User.getLogin([email, password], function(error, user) {
        if (error) {
            response.send(error);
        }
        response.send(user);
    });
};

exports.updateById = function(request, response, next) {
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

exports.deleteById = function(request, response, next) {
    let memberNumber = request.params.memberNumber;
   
    User.deleteById(memberNumber, function(error, user) {
        if (error) {
            response.send(error);
        }
        response.send(user);
    });
};