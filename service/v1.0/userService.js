const { ErrorHandler }      = require('../../costomModules/customError')
const User                  = require('../../dao/v1.0/userDao.js')
const Step					= require('step')
const isEmpty               = require('../../costomModules/valueCheck')
const util                  = require('../../costomModules/util')
const mail                  = require('../../costomModules/node-mailer')
const logger                = require('../../config/logger')

exports.createUser = function(request, response, next) {
    let setValues = {
        email, password, name, nickName, phoneNumber
    } = request.body
    logger.info(`Request Values = setValues: ${setValues}`)

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

    Step (
        function userEmailCheck() {
            User.selectEmailDuplicateCheck([email], this)
        },
        function userEmailDuplicateCheckResult(error, result) {
            if (error) {
                throw new ErrorHandler(500, error)
            }
            
            if (result[0] != null || result[0] != undefined) {
                response.status(200).send("Email is duplicate")
            } else {
                User.selectNickNameDuplicateCheck([nickName], this)
            }
        },
        function userNickNameDuplicateCheckResult(error, result) {
            if (error) {
                throw new ErrorHandler(500, error)
            }
            
            if (result[0] != null || result[0] != undefined) {
                response.status(200).send("NickName is duplicate")
            } else {
                User.createUser(setValues, function(error, results) {
                    if (error) {
                        return next(new ErrorHandler(500, error))
                    }
                    response.status(200).send(results)
                })
            }
        }
    )
}

exports.getUserById = function(request, response, next) {
    let memberNumber = request.params.memberNumber
    logger.info(`Request Values = memberNumber: ${memberNumber}`)

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

exports.getLogin = function(request, response, next) {
    const setValues = {
        email, password
    } = request.body
    logger.info(`Request Values = setValues: ${setValues}`)

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

exports.updateById = function(request, response, next) {
    let memberNumber = request.params.memberNumber
    const setValues = {
        password, nickName, phoneNumber
    } = request.body
    logger.info(`Request Values = setValues: ${setValues} / memberNumber: ${memberNumber}`)

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

    Step (
        function getUserInfo() {
            User.getUserById([memberNumber], this)
        },
        function getUserInfoResult(error, result) {
            if (error) {
				throw new ErrorHandler(500, error)
            }

            if (result[0] == null || result[0] == undefined) {
                response.status(404).send("User does not exist")
            } else {
                return result[0]
            }
        },
        function updateUserById(error, result) {
            if (error) {
                throw new ErrorHandler(500, error)
            }
            password = (!password) ? result.password : password
            nickName = (!nickName) ? result.nickName : nickName
            phoneNumber = (!phoneNumber) ? result.phoneNumber : phoneNumber

            User.updateById([password, nickName, phoneNumber, memberNumber], function(error, results) {
                if (error) {
                    return next(new ErrorHandler(500, error))
                }
                response.status(200).send(results)
            })
        }
    )
}

exports.deleteById = function(request, response, next) {
    let memberNumber = request.params.memberNumber
    logger.info(`Request Values = memberNumber: ${memberNumber}`)

    const nullValueCheckObject = {
        memberNumber
    }
    isEmpty(nullValueCheckObject)
    
    User.deleteById(memberNumber, function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))   
        }
        response.status(200).send(results)    
    })
}

exports.userEmailDuplicateCheck = function(request, response, next) {
    let email = request.params.email  
    logger.info(`Request Values = email: ${email}`)  

    const nullValueCheckObject = {
        email
    }
    isEmpty(nullValueCheckObject)

    User.selectEmailDuplicateCheck(email, function(error, results) {
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
    logger.info(`Request Values = nickName: ${nickName}`)

    const nullValueCheckObject = {
        nickName
    }
    isEmpty(nullValueCheckObject)

    User.selectNickNameDuplicateCheck(nickName, function(error, results) {
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
    logger.info(`Request Values = setValues: ${setValues}`)

    const nullValueCheckObject = {
        name, phoneNumber
    }
    isEmpty(nullValueCheckObject)

    User.selectUserFindEmail([name, phoneNumber], function(error, results) {
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

exports.userPasswordReset = function(request, response, next) {
    const setValues = {
        password, memberNumber
    } = request.body
    logger.info(`Request Values = setValues: ${setValues}`)
    
    const nullValueCheckObject = {
        password, memberNumber
    }
    isEmpty(nullValueCheckObject)

    User.updatePasswordById([password, memberNumber], function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }

        response.status(200).send(results)
    })
}

exports.userSendSecurityCode = function(request, response, next) {
    const setValues = {
        email, phoneNumber
    } = request.body
    logger.info(`Request Values = setValues: ${setValues}`)

    const nullValueCheckObject = {
        email, phoneNumber
    }
    isEmpty(nullValueCheckObject)

    Step (
        function selectUserFindEmail() {
            User.selectOneUserCheckEmail([email, phoneNumber], this)
        },
        function sendSecurityCodeToUserEmail(error, result) {
            if (error) {
				throw new ErrorHandler(500, error)
            }

            if (result[0] == null || result[0] == undefined) {
                response.status(404).send("User does not exist")
            }

            var passwordSecurityCode = util.createPasswordSecurityCode()
            
            let emailParam = {
                toEmail : result[0].email,
                toName : result[0].name,
                text : "비밀번호 변경을 위한 보안코드 입니다.\n다음 코드를 입력해주세요 : " + passwordSecurityCode
            }

            mail.sendGmail(emailParam, this)
            
            result[0].passwordSecurityCode = passwordSecurityCode
            return result[0]
        },
        function sendGmailResult(error, result) {
            if (error) {
				throw new ErrorHandler(500, error)
            }

            return result = { memberNumber : result.memberNumber, email : result.email, name : result.name, passwordSecurityCode : result.passwordSecurityCode, message : "Email send success !!!"}
        },
        function insertPasswordSecurityCode(error, result) {
            if (error) {
				throw new ErrorHandler(500, error)
            }
            
            User.insertPasswordSecurityCode([result.passwordSecurityCode, email, phoneNumber], function(error, results) {
                if (error) {
                    return next(new ErrorHandler(500, error))
                }
                delete result.passwordSecurityCode
                results.emailSendResult = result
                response.status(200).send(results)
            })
        }
    )
}

exports.userCheckSecurityCode = function(request, response, next) {
    const setValues = {
        securityCode, email, phoneNumber
    } = request.body
    logger.info(`Request Values = setValues: ${setValues}`)
    
    const nullValueCheckObject = {
        securityCode, email, phoneNumber
    }
    isEmpty(nullValueCheckObject)

    User.selectPasswordSecurityCodeCheck([securityCode, email, phoneNumber], function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }
        
        if(results.length == 0 || results.length == undefined) {
            response.status(404).send(results[0])
        } else {
            delete results[0].securityCode
            results[0].matchResult = true
            response.status(200).send(results[0])
        }
    })
}
