/* ==================== START modules ==================== */

const User = require('../dao/userDao.js');
const { ErrorHandler, handleError } = require('../costomModules/customError')
const isEmpty = require('../costomModules/valueCheck')

/* ==================== END modules ==================== */

exports.createUser = function(request, response, next) {
    let setValues = {
        email, password, name, nickName, phoneNumber
    } = request.body

    isEmpty('email', email)
    isEmpty('password', password)
    if (password.length < 8 || password.length > 16) {
        console.log("password : " + password + ", password size : " + password.length)
        throw new ErrorHandler(400, 'password size is not valid')
    }
    
    isEmpty('name', name)
    isEmpty('nickName', nickName)
    isEmpty('phoneNumber', phoneNumber)
    if (phoneNumber.length < 11 || phoneNumber.length > 14) {
        throw new ErrorHandler(400, 'phoneNumber size is not valid')
    }

    User.createUser(setValues, function(error, user) {
        if (error) {
            console.log(__filename + ", User.createUser() error status code 500 !!!")
            return next(new ErrorHandler(500, error))
        }
        response.status(200).send(user)
    })
}

exports.getUserById = function(request, response, next) {
    let memberNumber = request.params.memberNumber

    User.getUserById(memberNumber, function(error, user) {
        if (error) {
            console.log(__filename + ", User.getUserById() error status code 500 !!!")
            return next(new ErrorHandler(500, error))   
        }

        if(user.length == 0) {
            response.status(404).send("User does not exist")
        } else {
            response.status(200).send(user)
        }
    })
}

exports.getLogin = function(request, response, next) {
    const setValues = {
        email, password
    } = request.body

    isEmpty('email', email)
    isEmpty('password', password)

    User.getLogin([email, password], function(error, user) {
        if (error) {
            console.log(__filename + ", User.getLogin() error status code 500 !!!")
            return next(new ErrorHandler(500, error))
        }

        if(user.length == 0) {
            response.status(404).send("User does not exist")
        } else {    
            response.status(200).send(user)
        }
    })
}

exports.updateById = function(request, response, next) {
    let memberNumber = request.params.memberNumber;
    const setValues = {
        password, nickName, phoneNumber
    } = request.body

    if (!memberNumber || memberNumber == "") {
        throw new ErrorHandler(400, 'memberNumber is null !!!')
    }

    isEmpty('password', password)
    isEmpty('nickName', nickName)
    isEmpty('phoneNumber', phoneNumber)

    User.updateById([password, nickName, phoneNumber, memberNumber], function(error, user) {
        if (error) {
            console.log(__filename + ", User.updateById() error status code 500 !!!")
            return next(new ErrorHandler(500, error))   
        }
        response.status(200).send(user)
    })
}

exports.deleteById = function(request, response, next) {
    let memberNumber = request.params.memberNumber;
    
    isEmpty('memberNumber', memberNumber)

    User.deleteById(memberNumber, function(error, user) {
        if (error) {
            console.log(__filename + ", User.deleteById() error status code 500 !!!")
            return next(new ErrorHandler(500, error))   
        }

        if (user.length == 0 || user.length == undefined) {
            response.status(404).send("User does not exist" )
        } else {
            response.status(200).send(user)
        }
    })
}