/* ==================== START modules ==================== */

const { ErrorHandler }      = require('../costomModules/customError')
const db                    = require('../config/db');

/* ==================== END modules ==================== */

var Images = function(images) {
    this.imageNumber = images.imageNumber
    this.placeNumber = images.placeNumber
    this.originalImageName = images.originalImageName
    this.savedImageName = images.savedImageName
    this.mimetype = images.mimetype
    this.imageSize = images.imageSize
}

Images.uploadImageFile = function(request, response) {
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

Images.getImageFile = function(request, response) {
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

/* insert place images query */
Images.insertPlaceImages = function([setImagesValues], response) {
    try {
        db((error, connection) => {
            const placeImagesSqlQuery = 'INSERT INTO place_images (placeNumber, originalImageName, savedImageName, mimetype, imageSize) VALUES ?'
            connection.query(placeImagesSqlQuery, [setImagesValues], function(error, results) {
                if (error) {
                    console.log(__filename + ': placeImagesSqlQuery * error: ', error)
                    connection.release()
                    return response(error, null)
                }
                console.log(__filename + ': placeImagesSqlQuery * response: ', results)
                connection.release()
                response(null, results)
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, 'database error' + error.statusCode + error.message)
    }
}

/* insert reivew images query */
Images.insertReviewImages = function([setImagesValues], response) {
    try {
        db((error, connection) => {
            const reviewImagesSqlQuery = 'INSERT INTO review_images (reviewNumber, originalImageName, savedImageName, mimetype, imageSize) VALUES ?'
            connection.query(reviewImagesSqlQuery, [setImagesValues], function(error, results) {
                if (error) {
                    console.log(__filename + ': reviewImagesSqlQuery * error: ', error)
                    connection.release()
                    return response(error, null)
                }
                console.log(__filename + ': reviewImagesSqlQuery * response: ', results)
                connection.release()
                response(null, results)
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, 'database error' + error.statusCode + error.message)
    }
}

module.exports= Images;