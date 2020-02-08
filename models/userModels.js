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

User.createUser = function(setValues, result) {
    console.log(__filename + " - setValues : " + setValues);

    db((err, connection) => {
        connection.query("INSERT INTO member SET ?", setValues, function(err, res) {
            connection.release();
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }
            result(null, res);
        });
    });
};

User.getUserById = function(memberNumber, result) {
    console.log(__filename + " - memberNumber : " + memberNumber);
    
    db((err, connection) => {
        connection.query("SELECT * FROM member WHERE memberNumber = ?", memberNumber, function(err, res) {
            connection.release();
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }
            result(null, res);
        });
    }); 
};

User.getLogin = function([email, password], result) {
    console.log(__filename + " - email : " + email);
    console.log(__filename + " - password : " + password);
    
    db((err, connection) => {
        connection.query("select * from member where email = ? && password = ?", [email, password], function(err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }
            else {
                result(null, res);
            }
        });
    }); 
}

User.updateById = function([password, nickName, phoneNumber, memberNumber], result) {
    console.log(__filename + " - memberNumber : " + memberNumber);
    console.log(__filename + " - password : " + password);
    console.log(__filename + " - nickName : " + nickName);
    console.log(__filename + " - phoneNumber : " + phoneNumber);

    db((err, connection) => {
        connection.query("UPDATE member SET password=?, nickName=?, phoneNumber=? WHERE memberNumber=?", [password, nickName, phoneNumber, memberNumber], function(err, res) {
            connection.release();
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }
            result(null, res);
        });
    });

    // sql.query("UPDATE member SET password=?, nickName=?, phoneNumber=? WHERE memberNumber=?", [password, nickName, phoneNumber, memberNumber], function(err, res) {
    //     if(err) {
    //         console.log("error: ", err);
    //         result(err, null);
    //     }
    //     else{
    //         result(null, res);
    //     }
    // });   
};

User.deleteById = function(memberNumber, result) {
    console.log(__filename + " - memberNumber : " + memberNumber);

    db((err, connection) => {
        connection.query("DELETE FROM member WHERE memberNumber = ?", memberNumber, function(err, res) {
            connection.release();
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }
            result(null, res);
        });
    });
};

module.exports= User;