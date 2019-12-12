/* ==================== START modules ==================== */

const db            = require('../config/db');

/* ==================== END modules ==================== */

var Images = function(images) {
    this.fileName = images.fileName;
    this.fileExtension = images.fileExtension;
}

Images.getImageFile = function(request, response) {
    console.log("여기까지 무사 도착 111111111111111111111");
    
    db((error, connection) => {
        console.log("여기까지 무사 도착 2222222222222222222");
        // INSERT INTO files (fileName) VALUES (?)
        // INSERT INTO files SET ?
        connection.query("INSERT INTO files (fileName) VALUES (?)", request, function(err, res) {
            if (error) {
                console.log("error: ", error);
            }
            console.log(res);
            response(null, res);
            connection.release();
        });
    });
};

module.exports= Images;