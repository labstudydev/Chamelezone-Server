/* ==================== START modules ==================== */

const db            = require('../config/db');

/* ==================== END modules ==================== */

var Images = function(images) {
    this.fileName = images.fileName;
    this.fileExtension = images.fileExtension;
}

Images.getImageFile = function(request, response) {
    
    db((error, connection) => {
        // INSERT INTO files (fileName) VALUES (?)
        // INSERT INTO files SET ?
        connection.query("INSERT INTO files (fileName) VALUES (?)", request, function(error, results) {
            if (error) {
                console.log("error: ", error);
                response(error, null);
            }
            console.log(results);
            response(null, results);
            connection.release();
        });
    });
};

module.exports= Images;