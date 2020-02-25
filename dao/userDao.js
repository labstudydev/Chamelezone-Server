/* ==================== START modules ==================== */

const db            = require('../config/db')
const { ErrorHandler, handleError } = require('../costomModules/customError')

/* ==================== END modules ==================== */

var User = function(user) { }

User.createUser = function(request, response) {
    try {
        db((error, connection) => {
            const insertUserSqlQuery = `INSERT INTO member SET ?`
            connection.query(insertUserSqlQuery, request, function(error, results) {
                connection.release()
                if (error) {
                    console.log("error: ", error)
                    return response(error, null)
                }
                console.log('response: ', results)
                response(null, results)
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, 'database error' + error.statusCode + error.message)
    }
}

User.getUserById = function(request, response) {
    try {
        db((error, connection) => {
            const selectUserByIdSqlQuery = `SELECT * FROM member WHERE memberNumber = ?`
            connection.query(selectUserByIdSqlQuery, request, function(error, results, fields) {
                connection.release()
                if (error) {
                    console.log("error: ", error)
                    return response(error, null)
                }
                console.log('response: ', results)
                response(null, results)
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, 'database error' + error.statusCode + error.message)
    }
}

User.getLogin = function([email, password], response) {
    try {
        db((error, connection) => {
            const selectUserLoginSqlQuery = `SELECT memberNumber, email, name, nickName, phoneNumber, DATE_FORMAT(regiDate, '%Y-%m-%d') as regiDate FROM member WHERE email = ? && password = ?`
            connection.query("", [email, password], function(error, results) {
                connection.release()
                if (error) {
                    console.log("error: ", error)
                    return response(error, null)
                }
                console.log('response: ', results)
                response(null, results)
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, 'database error' + error.statusCode + error.message)
    }
}

User.updateById = function([password, nickName, phoneNumber, memberNumber], response) {
    try {
        db((error, connection) => {
            const updateUserSqlQuery = `UPDATE member SET password=?, nickName=?, phoneNumber=? WHERE memberNumber=?`
            connection.query(updateUserSqlQuery, [password, nickName, phoneNumber, memberNumber], function(error, results) {
                connection.release()
                if (error) {
                    console.log("error: ", error)
                    return response(error, null)
                }
                console.log('response: ', results)
                response(null, results)
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, 'database error' + error.statusCode + error.message)
    }
}

User.deleteById = function(request, response) {
    try {
        db((error, connection) => {
            const deleteUserById = `DELETE FROM member WHERE memberNumber = ?`
            connection.query(deleteUserById, request, function(error, results) {
                connection.release()
                if (error) {
                    console.log("error: ", error)
                    return response(error, null)
                }
                console.log('response: ', results)
                response(null, results)
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, 'database error' + error.statusCode + error.message)
    }
}

User.selectByMemberNumber = function(memberNumber, response) {
    try {
        db((error, connection) => {
            const selectByEamilSqlQuery = 'SELECT memberNumber FROM member WHERE memberNumber = ?'
            connection.query(selectByEamilSqlQuery, memberNumber, function(error, results) {
                connection.release()
                if (error) {
                    console.log(__filename + ': selectByEamilSqlQuery * error: ', error)
                    return response(error, null)
                }
                console.log(__filename + ': selectByEamilSqlQuery * response: ', results)
                response(null, results)
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, 'database error' + error.statusCode + error.message)
    }
}

User.selectEmailDuplicateCheck = function(email, response) {
    try {
        db((error, connection) => {
            const selectEmailDuplicateCheckSqlQuery = `SELECT email FROM member WHERE email = ?`
            connection.query(selectEmailDuplicateCheckSqlQuery, email, function(error, results) {
                connection.release()
                if (error) {
                    console.log(__filename + ': selectEmailDuplicateCheck * error: ', error)
                    return response(error, null)
                }
                console.log(__filename + ': selectEmailDuplicateCheck * response: ', results)
                response(null, results)
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, 'database error' + error.statusCode + error.message)
    }
}

User.selectNickNameDuplicateCheck = function(nickName, response) {
    try {
        db((error, connection) => {
            const selectNickNameDuplicateCheckSqlQuery = `SELECT nickName FROM member WHERE nickName = ?`
            connection.query(selectNickNameDuplicateCheckSqlQuery, nickName, function(error, results) {
                connection.release()
                if (error) {
                    console.log(__filename + ': selectNickNameDuplicateCheckSqlQuery * error: ', error)
                    return response(error, null)
                }
                console.log(__filename + ': selectNickNameDuplicateCheckSqlQuery * response: ', results)
                response(null, results)
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, 'database error' + error.statusCode + error.message)
    }
}

User.selectUserFindEmail = function([name, phoneNumber], response) {
    try {
        db((error, connection) => {
            const selectFindUserEmailSqlQuery = `SELECT name, email, phoneNumber FROM member WHERE name = ? AND phoneNumber = ?`
            connection.query(selectFindUserEmailSqlQuery, [name, phoneNumber], function(error, results) {
                connection.release()
                if (error) {
                    console.log(__filename + ': selectFindUserEmailSqlQuery * error: ', error)
                    return response(error, null)
                }
                console.log(__filename + ': selectFindUserEmailSqlQuery * response: ', results)
                response(null, results)
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, 'database error' + error.statusCode + error.message)
    }
}

User.selectOneUserCheckEmail = function([email, phoneNumber], response) {
    try {
        db((error, connection) => {
            const selectOneFindUserCheckEmailSqlQuery = `SELECT memberNumber, name, email, phoneNumber FROM member WHERE email = ? AND phoneNumber = ?`
            connection.query(selectOneFindUserCheckEmailSqlQuery, [email, phoneNumber], function(error, results) {
                connection.release()
                if (error) {
                    console.log(__filename + ': selectOneFindUserCheckEmailSqlQuery * error: ', error)
                    return response(error, null)
                }
                console.log(__filename + ': selectOneFindUserCheckEmailSqlQuery * response: ', results)
                response(null, results)
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, 'database error' + error.statusCode + error.message)
    }
}

User.updatePasswordById = function([password, memberNumber], response) {
    try {
        db((error, connection) => {
            const updateUserPasswordResetSqlQuery = `UPDATE member SET password = ? WHERE memberNumber = ?`
            connection.query(updateUserPasswordResetSqlQuery, [password, memberNumber], function(error, results) {
                connection.release()
                if (error) {
                    console.log(__filename + ': updateUserPasswordResetSqlQuery * error: ', error)
                    return response(error, null)
                }
                console.log(__filename + ': updateUserPasswordResetSqlQuery * response: ', results)
                response(null, results)
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, 'database error' + error.statusCode + error.message)
    }
}

module.exports = User