/* ==================== START modules ==================== */
const mysql         = require('mysql');
const dbConfig      = require('../config/dbConfig');
const bodyParser    = require('body-parser');
/* ==================== END modules ==================== */

/* ==================== START DB Connection ==================== */
var dbOptions = {
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database
};

var sql = mysql.createConnection(dbOptions);
sql.connect();
/* ==================== END DB Connection ==================== */


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

User.createUser = function(setValues, result) {
    console.log(__filename + " - setValues : " + setValues);

    sql.query("INSERT INTO member SET ?", setValues, function(err, res) {
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            result(null, res);
        }
    });
};

User.getUserById = function(memberNumber, result) {
    console.log(__filename + " - memberNumber : " + memberNumber);

    sql.query("SELECT * FROM member WHERE memberNumber = ?", memberNumber, function(err, res) {
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            result(null, res);
        }
    });   
};

User.getLogin = function([email, password], result) {
    console.log(__filename + " - email : " + email);
    console.log(__filename + " - password : " + password);
    
    sql.query("select * from member where email = ? && password = ?", [email, password], function(err, res) {
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            result(null, res);
        }
    });   
}

User.updateById = function([password, nickName, phoneNumber, memberNumber], result) {
    console.log(__filename + " - memberNumber : " + memberNumber);
    console.log(__filename + " - password : " + password);
    console.log(__filename + " - nickName : " + nickName);
    console.log(__filename + " - phoneNumber : " + phoneNumber);

    sql.query("UPDATE member SET password=?, nickName=?, phoneNumber=? WHERE memberNumber=?", [password, nickName, phoneNumber, memberNumber], function(err, res) {
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            result(null, res);
        }
    });   
};

User.deleteById = function(memberNumber, result) {
    console.log(__filename + " - memberNumber : " + memberNumber);

    sql.query("DELETE FROM member WHERE memberNumber = ?", memberNumber, function(err, res) {
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            result(null, res);
        }
    });   
};

module.exports= User;