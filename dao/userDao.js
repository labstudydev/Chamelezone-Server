/* ==================== START modules ==================== */

const db            = require('../config/db');

/* ==================== END modules ==================== */

var User = function(user) {
    this.memberNumber = user.memberNumber;
    this.email = user.email;
    this.password = user.password;
    this.name = user.name;
    this.birth = user.birth;
    this.gender = user.gender;
    this.phoneNumber = user.phoneNumber;
    this.regiDate = user.regiDate;
};

User.createUser = function(request, response) {
    db((error, connection) => {
        connection.query("INSERT INTO member SET ?", request, function(error, results) {
            if (error) {
                console.log("error: ", error);
                response(error, null);
            }
            console.log('response: ', results);
            response(null, results);
            connection.release();
        });
    });
};

User.getUserById = function(request, response) {

    db((error, connection) => {
        connection.query("SELECT * FROM member WHERE memberNumber = ?", request, function(error, results) {
            if (error) {
                console.log("error: ", error);
                response(error, null);
            }
            console.log('response: ', results);
            response(null, results);
            connection.release();
        });
    });
};

User.getLogin = function([email, password], response) {
    console.log(__filename + " - email : " + email);
    console.log(__filename + " - password : " + password);
    
    db((error, connection) => {
        connection.query("select * from member where email = ? && password = ?", [email, password], function(error, results) {
            if (error) {
                console.log("error: ", error);
                response(error, null);
            }
            console.log('response: ', results);
            response(null, results);
            connection.release();
        });
    }); 
}

User.updateById = function([password, nickName, phoneNumber, memberNumber], response) {

    db((error, connection) => {
        connection.query("UPDATE member SET password=?, nickName=?, phoneNumber=? WHERE memberNumber=?", [password, nickName, phoneNumber, memberNumber], function(error, results) {
            if (error) {
                console.log("error: ", error);
                response(error, null);
            }
            console.log('response: ', results);
            response(null, results);
            connection.release();
        });
    });
};

User.deleteById = function(request, response) {

    db((error, connection) => {
        connection.query("DELETE FROM member WHERE memberNumber = ?", request, function(error, results) {
            if (error) {
                console.log("error: ", error);
                response(error, null);
            }
            console.log('response: ', results);
            response(null, results);
            connection.release();
        });
    });
};

module.exports= User;