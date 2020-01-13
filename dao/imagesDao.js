/* ==================== START modules ==================== */

const db            = require('../config/db');
const { ErrorHandler, handleError } = require('../costomModules/customError')

/* ==================== END modules ==================== */

var Images = function(images) {
    this.fileName = images.fileName;
    this.fileExtension = images.fileExtension;
}

Images.uploadImageFile = function(request, response, next) {
    try {
        db((error, connection) => {
            connection.query("INSERT INTO files (placeNumber, originalFileName, savedFileName, mimetype, fileSize) VALUES (1, ?, ?, ?, ?)", request, function(error, results) {
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

Images.getImageFile = function(request, response, next) {
    try {
        db((error, connection) => {
            connection.query("SELECT fileNumber, placeNumber, originalFileName, savedFileName FROM files WHERE placeNumber = ?;", request, function(error, results) {
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

module.exports= Images;