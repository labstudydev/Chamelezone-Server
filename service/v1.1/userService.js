const { ErrorHandler }      = require('../../costomModules/customError')
const User                  = require('../../dao/v1.1/userDao.js')
const Step					= require('step')
const util                  = require('../../costomModules/util')
const mail                  = require('../../costomModules/node-mailer')             

exports.createUser = function([email, password, name, nickName, phoneNumber], response, next) {
    try {
        Step (
            function userEmailCheck() {
                User.selectEmailDuplicateCheck([email], this)
            },
            function userEmailDuplicateCheckResult(error, result) {
                if (error) {
                    throw new ErrorHandler(500, error)
                }

                if (result.length > 0) {
                    return response(null, "Email is duplicate")
                } else {
                    User.selectNickNameDuplicateCheck([nickName], this)
                }
            },
            function userNickNameDuplicateCheckResult(error, result) {
                if (error) {
                    throw new ErrorHandler(500, error)
                }
                
                if (result[0] != null || result[0] != undefined) {
                    return response(null, "NickName is duplicate")
                } else {
                    User.createUser([email, password, name, nickName, phoneNumber], function(error, results) {
                        if (error) { return response(error, null) }
                        response(null, results)
                    })
                }
            }
        )
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

exports.getUserById = function(memberNumber, response, next) {
    try {
        User.getUserById(memberNumber, function(error, results) {    
            if (error) { return response(error, null) }
            response(null, results)
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

exports.getLogin = function([email, password], response, next) {
    try {
        User.getLogin([email, password], function(error, results) {
            if (error) { return response(error, null) }
            response(null, results)
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

exports.updateById = function([memberNumber, password, nickName, phoneNumber], response, next) {
    try {
        Step (
            function getUserInfo() {
                User.getUserById([memberNumber], this)
            },
            function getUserInfoResult(error, result) {
                if (error) {
                    throw new ErrorHandler(500, error)
                }
    
                if (result[0] == null || result[0] == undefined) {
                    return response(null, "User does not exist")
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
                    if (error) { return response(error, null) }
                    response(null, results)
                })
            }
        )
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

exports.deleteById = function(memberNumber, response, next) {
    try {
        User.deleteById(memberNumber, function(error, results) {
            if (error) { return response(error, null) }
            response(null, results)
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

exports.userEmailDuplicateCheck = function([email], response, next) {
    try {
        User.selectEmailDuplicateCheck([email], function(error, results) {
            if (error) { return response(error, null) }
            response(null, results)
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

exports.userNickNameDuplicateCheck = function([nickName], response, next) {
    try {
        User.selectNickNameDuplicateCheck([nickName], function(error, results) {
            if (error) { return response(error, null) }
            response(null, results)
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

exports.userEmailFind = function([name, phoneNumber], response, next) {
    try {
        User.selectUserFindEmail([name, phoneNumber], function(error, results) {
            if (error) { return response(error, null) }
            response(null, results)
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

exports.userSendSecurityCode = function([email, phoneNumber], response, next) {
    try {
        Step (
            function selectUserFindEmail() {
                User.selectOneUserCheckEmail([email, phoneNumber], this)
            },
            function sendSecurityCodeToUserEmail(error, result) {
                if (error) {
                    throw new ErrorHandler(500, error)
                }
    
                if (result[0] == null || result[0] == undefined) {
                    return response(null, 404)
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
                    if (error) { return response(error, null) }
                    delete result.passwordSecurityCode
                    results.emailSendResult = result
                    response(null, results)
                })
            }
        )
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

exports.userCheckSecurityCode = function([securityCode, email, phoneNumber], response, next) {
    try {
        User.selectPasswordSecurityCodeCheck([securityCode, email, phoneNumber], function(error, results) {
            if (error) {
                return next(new ErrorHandler(500, error))
            }
            
            if(results.length == 0 || results.length == undefined) {
                response(null, 404)
            } else {
                delete results[0].securityCode
                results[0].matchResult = true
                response(null, results[0])
            }
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

exports.userPasswordReset = function([password, memberNumber], response, next) {
    try {
        User.updatePasswordById([password, memberNumber], function(error, results) {
            if (error) { return response(error, null) }
            response(null, results)
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}