const { ErrorHandler }      = require('../../costomModules/customError')
const db                    = require('../../config/db')

var User = function(user) { }

User.createUser = function([email, password, name, nickName, phoneNumber], response) {
    try {
        db((error, connection) => {
            const insertUserSqlQuery = `INSERT INTO member (email, password, name, nickName, phoneNumber) VALUES (?, ?, ?, ?, ?)`
            connection.query(insertUserSqlQuery, [email, password, name, nickName, phoneNumber], function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) { 
        throw new ErrorHandler(500, error)
    }
}

User.getUserById = function(request, response) {
    try {
        db((error, connection) => {
            const selectUserByIdSqlQuery = `SELECT memberNumber, email, password, name, nickName, phoneNumber FROM member WHERE memberNumber = ?`
            connection.query(selectUserByIdSqlQuery, request, function(error, results, fields) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

User.getLogin = function([email, password], response) {
    try {
        db((error, connection) => {
            const selectUserLoginSqlQuery = `SELECT memberNumber, email, name, nickName, phoneNumber, DATE_FORMAT(regiDate, '%Y-%m-%d') as regiDate FROM member WHERE email = ? && password = ?`
            connection.query(selectUserLoginSqlQuery, [email, password], function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

User.updateById = function([password, nickName, phoneNumber, memberNumber], response) {
    try {
        db((error, connection) => {
            const updateUserSqlQuery = `UPDATE member SET password=?, nickName=?, phoneNumber=? WHERE memberNumber=?`
            connection.query(updateUserSqlQuery, [password, nickName, phoneNumber, memberNumber], function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

User.deleteById = function(request, response) {
    try {
        db((error, connection) => {
            const deleteUserById = `DELETE FROM member WHERE memberNumber = ?`
            connection.query(deleteUserById, request, function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

User.selectByMemberNumber = function(memberNumber, response) {
    try {
        db((error, connection) => {
            const selectByEamilSqlQuery = 'SELECT memberNumber FROM member WHERE memberNumber = ?'
            connection.query(selectByEamilSqlQuery, memberNumber, function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

User.selectEmailDuplicateCheck = function(email, response) {
    try {
        db((error, connection) => {
            const selectEmailDuplicateCheckSqlQuery = `SELECT email FROM member WHERE email = ?`
            connection.query(selectEmailDuplicateCheckSqlQuery, email, function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

User.selectNickNameDuplicateCheck = function(nickName, response) {
    try {
        db((error, connection) => {
            const selectNickNameDuplicateCheckSqlQuery = `SELECT nickName FROM member WHERE nickName = ?`
            connection.query(selectNickNameDuplicateCheckSqlQuery, nickName, function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

User.selectUserFindEmail = function([name, phoneNumber], response) {
    try {
        db((error, connection) => {
            const selectFindUserEmailSqlQuery = `SELECT name, email, phoneNumber FROM member WHERE name = ? AND phoneNumber = ?`
            connection.query(selectFindUserEmailSqlQuery, [name, phoneNumber], function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

User.selectOneUserCheckEmail = function([email, phoneNumber], response) {
    try {
        db((error, connection) => {
            const selectOneFindUserCheckEmailSqlQuery = `SELECT memberNumber, name, email, phoneNumber FROM member WHERE email = ? AND phoneNumber = ?`
            connection.query(selectOneFindUserCheckEmailSqlQuery, [email, phoneNumber], function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

User.updatePasswordById = function([password, memberNumber], response) {
    try {
        db((error, connection) => {
            const updateUserPasswordResetSqlQuery = `UPDATE member SET password = ? WHERE memberNumber = ?`
            connection.query(updateUserPasswordResetSqlQuery, [password, memberNumber], function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

User.insertPasswordSecurityCode = function(request, response) {
    try {
        db((error, connection) => {
            const insertPasswordSecurityCodeSqlQuery = `INSERT INTO password_security_code (securityCode, email, phoneNumber) VALUES (?, ?, ?)`
            connection.query(insertPasswordSecurityCodeSqlQuery, request, function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

User.selectPasswordSecurityCodeCheck = function([securityCode, email, phoneNumber], response) {
    try {
        db((error, connection) => {
            const selectPasswordSecurityCodeCheckSqlQuery = `SELECT securityCode, email, phoneNumber FROM password_security_code WHERE securityCode = ? AND email = ? AND phoneNumber = ?`
            connection.query(selectPasswordSecurityCodeCheckSqlQuery, [securityCode, email, phoneNumber], function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

module.exports = User