/* ==================== START modules ==================== */

const User = require('../dao/userDao.js')
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

    User.createUser(setValues, function(error, results) {
        if (error) {
            console.log(__filename + ", User.createUser() error status code 500 !!!")
            return next(new ErrorHandler(500, error))
        }
        response.status(200).send(results)
    })
}

exports.getUserById = function(request, response, next) {
    let memberNumber = request.params.memberNumber

    User.getUserById(memberNumber, function(error, results) {
        if (error) {
            console.log(__filename + ", User.getUserById() error status code 500 !!!")
            return next(new ErrorHandler(500, error))   
        }

        if(results.length == 0) {
            response.status(404).send("User does not exist")
        } else {
            response.status(200).send(results[0])
        }
    })
}

exports.getLogin = function(request, response, next) {
    const setValues = {
        email, password
    } = request.body

    isEmpty('email', email)
    isEmpty('password', password)

    User.getLogin([email, password], function(error, results) {
        if (error) {
            console.log(__filename + ", User.getLogin() error status code 500 !!!")
            return next(new ErrorHandler(500, error))
        }

        if(results.length == 0) {
            response.status(404).send("User does not exist")
        } else {    
            response.status(200).send(results[0])
        }
    })
}

exports.updateById = function(request, response, next) {
    let memberNumber = request.params.memberNumber
    const setValues = {
        password, nickName, phoneNumber
    } = request.body

    isEmpty('memberNumber', memberNumber)
    isEmpty('password', password)
    isEmpty('nickName', nickName)
    isEmpty('phoneNumber', phoneNumber)

    User.updateById([password, nickName, phoneNumber, memberNumber], function(error, results) {
        if (error) {
            console.log(__filename + ", User.updateById() error status code 500 !!!")
            return next(new ErrorHandler(500, error))   
        }
        
        response.status(200).send(results)
    })
}

exports.deleteById = function(request, response, next) {
    let memberNumber = request.params.memberNumber
    isEmpty('memberNumber', memberNumber)

    User.deleteById(memberNumber, function(error, results) {
        if (error) {
            console.log(__filename + ", User.deleteById() error status code 500 !!!")
            return next(new ErrorHandler(500, error))   
        }
        response.status(200).send(results)    
    })
}

exports.userEmailDuplicateCheck = function(request, response, next) {
    let email = request.params.email
    isEmpty('email', email)

    User.selectEmailDuplicateCheck(email, function(error, results) {
        if (error) {
            console.log(__filename + ", User.selectEmailDuplicateCheck() error status code 500 !!!")
            return next(new ErrorHandler(500, error))
        }

        if(results.length == 0 || results.length == undefined) {
            results[0] = { status : 200, email_check : "Y", message : "Email is not duplicate"}
            response.status(200).send(results[0])
        } else {
            results[0] = { status : 409, email_check : "N", message : "Email is duplicate"}
            response.status(409).send(results[0])
        }  
    })
}

exports.userNickNameDuplicateCheck = function(request, response, next) {
    let nickName = request.params.nickName
    isEmpty('nickName', nickName)

    User.selectNickNameDuplicateCheck(nickName, function(error, results) {
        if (error) {
            console.log(__filename + ", User.selectNickNameDuplicateCheck() error status code 500 !!!")
            return next(new ErrorHandler(500, error))
        }

        if(results.length == 0 || results.length == undefined) {
            results[0] = { status : 200, nickName_check : "Y", message : "NickName is not duplicate"}
            response.status(200).send(results[0])
        } else {
            results[0] = { status : 409, nickName_check : "N", message : "NickName is duplicate"}
            response.status(409).send(results[0])
        }  
    })
}