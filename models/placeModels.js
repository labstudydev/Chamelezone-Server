/* ==================== START modules ==================== */

const db            = require('../config/db');

/* ==================== END modules ==================== */

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

    db((err, connection) => {
        connection.query("INSERT INTO place SET ?", setValues, function(err, res) {
            connection.release();
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }
            result(null, res);
        });
    });
};

Place.readOnePlace = function(placeNumber, result) {
    console.log(__filename + " - placeNumber : " + placeNumber);

    db((err, connection) => {
        connection.query("SELECT * FROM place WHERE placeNumber = ?", placeNumber, function(err, res) {
            connection.release();
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }
            result(null, res);
        });
    });
};

Place.readAllPlace = function(result) {
    
    db((err, connection) => {
        connection.query("SELECT * FROM place", function(err, res) {
            connection.release();
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }
            result(null, res);
        });
    });
};

Place.updatePlace = function([name, address, openingTime, phoneNumber, content, placeNumber], result) {
    console.log(__filename + " - name : " + name);
    console.log(__filename + " - address : " + address);
    console.log(__filename + " - openingTime : " + openingTime);
    console.log(__filename + " - phoneNumber : " + phoneNumber);
    console.log(__filename + " - content : " + content);
    console.log(__filename + " - placeNumber : " + placeNumber);

    db((err, connection) => {
        connection.query("UPDATE place SET name = ?, address = ?, openingTime = ?, phoneNumber = ?, content = ? WHERE placeNumber = ?", [name, address, openingTime, phoneNumber, content, placeNumber], function(err, res) {
            connection.release();
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }
            result(null, res);
        });
    });
};

Place.deletePlace = function(placeNumber, result) {
    console.log(__filename + " - placeNumber : " + placeNumber);

    db((err, connection) => {
        connection.query("DELETE FROM place WHERE placeNumber = ?", placeNumber, function(err, res) {
            connection.release();
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }
            result(null, res);
        });
    });
};

module.exports= Place;