const { ErrorHandler }      = require('../../costomModules/customError')
const isEmpty               = require('../../costomModules/valueCheck')
const User                  = require('../../service/v1.1/userService')

exports.userCreate = function(request, response, next) {
    let setValues = {
        email, password, name, nickName, phoneNumber
    } = request.body

    const nullValueCheckObject = {
        email, password, name, nickName, phoneNumber
    }
    isEmpty(nullValueCheckObject)

    if (password.length < 8 || password.length > 16) {
        throw new ErrorHandler(400, 'password size is not valid')
    }
    if (phoneNumber.length < 11 || phoneNumber.length > 14) {
        throw new ErrorHandler(400, 'phoneNumber size is not valid')
    }

    User.createUser([email, password, name, nickName, phoneNumber], function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }

        response.status(200).send(results)
    })
}

exports.userDetail = function(request, response, next) {
    let memberNumber = request.params.memberNumber
    const nullValueCheckObject = {
        memberNumber
    }
    isEmpty(nullValueCheckObject)

    User.getUserById(memberNumber, function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }
        
        if(results.length == 0) {
            response.status(404).send("User does not exist")
        } else {
            response.status(200).send(results[0])
        }  
    })
}

exports.userLogin = function(request, response, next) {
    const setValues = {
        email, password
    } = request.body
    const nullValueCheckObject = {
        email, password
    }
    isEmpty(nullValueCheckObject)

    User.getLogin([email, password], function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }
        
        if(results.length == 0) {
            response.status(404).send("User does not exist")
        } else {    
            response.status(200).send(results[0])
        } 
    })
}

exports.userUpdate = function(request, response, next) {
    let memberNumber = request.params.memberNumber
    const setValues = {
        password, nickName, phoneNumber
    } = request.body
    
    const nullValueCheckObject = {
        memberNumber
    }
    isEmpty(nullValueCheckObject)

    if (password.length < 8 || password.length > 16) {
        throw new ErrorHandler(400, 'password size is not valid')
    }
    if (phoneNumber.length < 11 || phoneNumber.length > 14) {
        throw new ErrorHandler(400, 'phoneNumber size is not valid')
    }

    User.updateById([memberNumber, password, nickName, phoneNumber], function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }

        response.status(200).send(results)
    })
}

exports.userDelete = function(request, response, next) {
    let memberNumber = request.params.memberNumber
    const nullValueCheckObject = {
        memberNumber
    }
    isEmpty(nullValueCheckObject)
    
    User.deleteById([memberNumber], function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }

        response.status(200).send(results)
    })
}

exports.userEmailDuplicateCheck = function(request, response, next) {
    let email = request.params.email    
    const nullValueCheckObject = {
        email
    }
    isEmpty(nullValueCheckObject)

    User.userEmailDuplicateCheck([email], function (error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }

        if(results.length == 0 || results.length == undefined) {
            results[0] = { status : 200, email_check : "Y", message : "Email is not duplicate"}
            response.status(200).send(results[0])
        } else {
            results[0] = { status : 200, email_check : "N", message : "Email is duplicate"}
            response.status(200).send(results[0])
        }
    })
}

exports.userNickNameDuplicateCheck = function(request, response, next) {
    let nickName = request.params.nickName
    const nullValueCheckObject = {
        nickName
    }
    isEmpty(nullValueCheckObject)

    User.userNickNameDuplicateCheck([nickName], function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }

        if(results.length == 0 || results.length == undefined) {
            results[0] = { status : 200, nickName_check : "Y", message : "NickName is not duplicate"}
            response.status(200).send(results[0])
        } else {
            results[0] = { status : 200, nickName_check : "N", message : "NickName is duplicate"}
            response.status(200).send(results[0])
        }
    })
}

exports.userEmailFind = function(request, response, next) {
    const setValues = {
        name, phoneNumber
    } = request.body
    const nullValueCheckObject = {
        name, phoneNumber
    }
    isEmpty(nullValueCheckObject)

    User.userEmailFind([name, phoneNumber], function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }

        if(results.length == 0 || results.length == undefined) {
            response.status(404).send(results[0])
        } else {
            response.status(200).send(results)
        }  
    })
}

exports.userSendSecurityCode = function(request, response, next) {
    const setValues = {
        email, phoneNumber
    } = request.body
    const nullValueCheckObject = {
        email, phoneNumber
    }
    isEmpty(nullValueCheckObject)

    User.userSendSecurityCode([email, phoneNumber], function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }

        if(results == 404) {
            response.status(404).send("User does not exist")
        } else {
            response.status(200).send(results)
        } 
    })
}

exports.userCheckSecurityCode = function(request, response, next) {
    const setValues = {
        securityCode, email, phoneNumber
    } = request.body
    
    const nullValueCheckObject = {
        securityCode, email, phoneNumber
    }
    isEmpty(nullValueCheckObject)

    User.userCheckSecurityCode([securityCode, email, phoneNumber], function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }

        if(results == 404) {
            results = {status : 404, matchResult : false}
            response.status(404).send(results)
        } else {
            response.status(200).send(results)
        } 
    })
}

exports.userPasswordReset = function(request, response, next) {
    const setValues = {
        password, memberNumber
    } = request.body
    
    const nullValueCheckObject = {
        password, memberNumber
    }
    isEmpty(nullValueCheckObject)

    User.userPasswordReset([password, memberNumber], function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }
        
        response.status(200).send(results)
    })
}