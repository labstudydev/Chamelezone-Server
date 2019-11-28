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

var Place = function(place) {
    this.placeNumber = place.placeNumber;
    this.keywordNumber = place.keywordNumber;
    this.name = place.name;
    this.address = place.address;
    this.openingTime = place.openingTime;
    this.phoneNumber = place.phoneNumber;
    this.content = place.content;
    this.fileName = place.fileName;
    this.fileExtension = place.fileExtension;
    this.regiDate = place.regiDate;
};


Place.createPlace = function(setValues, result) {
    console.log(__filename + " - setValues : " + setValues);

    sql.query("INSERT INTO place SET ?", setValues, function(err, res) {
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            result(null, res);
        }
    });
};

Place.readOnePlace = function(placeNumber, result) {
    console.log(__filename + " - placeNumber : " + placeNumber);

    sql.query("SELECT * FROM place WHERE placeNumber = ?", placeNumber, function(err, res) {
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            result(null, res);
        }
    });
};

Place.readAllPlace = function(placeNumber, result) {
    console.log(__filename + " - placeNumber : " + placeNumber);

    sql.query("SELECT * FROM place", function(err, res) {
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            result(null, res);
        }
    });
};

// 미구현
Place.updatePlace = function(placeNumber, result) {

    sql.query("INSERT INTO member SET ?", placeNumber, function(err, res) {
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            result(null, res);
        }
    });
};

Place.deletePlace = function(placeNumber, result) {
    console.log(__filename + " - placeNumber : " + placeNumber);

    sql.query("DELETE FROM place WHERE placeNumber = ?", placeNumber, function(err, res) {
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            result(null, res);
        }
    });
};
module.exports= Place;