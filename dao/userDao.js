/* ==================== START modules ==================== */

const db            = require('../config/db')
const { ErrorHandler, handleError } = require('../costomModules/customError')

/* ==================== END modules ==================== */

var User = function(user) { }

User.createUser = function(request, response) {
    try {
        db((error, connection) => {
            connection.query("INSERT INTO member SET ?", request, function(error, results) {
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
            connection.query("SELECT * FROM member WHERE memberNumber = ?", request, function(error, results, fields) {
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
            connection.query("select memberNumber, email, name, nickName, phoneNumber, regiDate from member where email = ? && password = ?", [email, password], function(error, results) {
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
            connection.query("UPDATE member SET password=?, nickName=?, phoneNumber=? WHERE memberNumber=?", [password, nickName, phoneNumber, memberNumber], function(error, results) {
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
            connection.query("DELETE FROM member WHERE memberNumber = ?", request, function(error, results) {
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

module.exports = User