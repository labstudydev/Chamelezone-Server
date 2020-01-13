/* ==================== START modules ==================== */

const db            = require('../config/db');
const { ErrorHandler, handleError } = require('../costomModules/customError')

/* ==================== END modules ==================== */

var User = function(user) {
    this.memberNumber = user.memberNumber;
    this.email = user.email;
    this.password = user.password;
    this.name = user.name;
    this.nickName = user.nickName;
    this.phoneNumber = user.phoneNumber;
    this.regiDate = user.regiDate;
};

User.createUser = function(request, response) {
    try {
        db((error, connection) => {
            connection.query("INSERT INTO member SET ?", request, function(error, results) {
                if (error) {
                    console.log("error: ", error)
                    connection.release()
                    return response(error, null)
                }
                console.log('response: ', results)
                response(null, results)
                connection.release()
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, 'database error' + error.statusCode + error.message)
    }
}

User.getUserById = function(request, response, next) {
    try {
        db((error, connection) => {
            connection.query("SELECT * FROM member WHERE memberNumber = ?", request, function(error, results, fields) {
                if (error) {
                    console.log("error: ", error)
                    connection.release()
                    return response(error, null)
                }
                console.log('response: ', results)
                response(null, results)
                connection.release()
            });
        })
    } catch (error) {
        throw new ErrorHandler(500, 'database error' + error.statusCode + error.message)
    }
};

User.getLogin = function([email, password], response, next) {
    console.log(__filename + " - email : " + email)
    console.log(__filename + " - password : " + password)

    try {
        db((error, connection) => {
            connection.query("select memberNumber, email, name, nickName, phoneNumber, regiDate from member where email = ? && password = ?", [email, password], function(error, results) {
                if (error) {
                    console.log("error: ", error)
                    connection.release()
                    return response(error, null)
                }
                console.log('response: ', results)
                response(null, results)
                connection.release()
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, 'database error' + error.statusCode + error.message)
    }
}

User.updateById = function([password, nickName, phoneNumber, memberNumber], response, next) {
    try {
        db((error, connection) => {
            connection.query("UPDATE member SET password=?, nickName=?, phoneNumber=? WHERE memberNumber=?", [password, nickName, phoneNumber, memberNumber], function(error, results) {
                if (error) {
                    console.log("error: ", error)
                    connection.release()
                    return response(error, null)
                }
                console.log('response: ', results)
                response(null, results)
                connection.release()
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, 'database error' + error.statusCode + error.message)
    }
}

User.deleteById = function(request, response, next) {
    try {
        db((error, connection) => {
            connection.query("DELETE FROM member WHERE memberNumber = ?", request, function(error, results) {
                if (error) {
                    console.log("error: ", error)
                    connection.release()
                    return response(error, null)
                }
                console.log('response: ', results)
                response(null, results)
                connection.release()
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, 'database error' + error.statusCode + error.message)
    }
}

module.exports= User;