/* ==================== START modules ==================== */

const { ErrorHandler }      = require('../costomModules/customError')
const db                    = require('../config/db')

/* ==================== END modules ==================== */

var Images = function(images) {

}

/* insert place images query */
Images.insertPlaceImages = function([setImagesValues], response) {
    try {
        db((error, connection) => {
            const insertPlaceImagesSqlQuery = 'INSERT INTO place_images (placeNumber, originalImageName, savedImageName, mimetype, imageSize) VALUES ?'
            connection.query(insertPlaceImagesSqlQuery, [setImagesValues], function(error, results) {
                if (error) {
                    console.log(__filename + ': insertPlaceImagesSqlQuery * error: ', error)
                    connection.release()
                    return response(error, null)
                }
                console.log(__filename + ': insertPlaceImagesSqlQuery * response: ', results)
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
            const insertReviewImagesSqlQuery = 'INSERT INTO review_images (reviewNumber, originalImageName, savedImageName, mimetype, imageSize) VALUES ?'
            connection.query(insertReviewImagesSqlQuery, [setImagesValues], function(error, results) {
                if (error) {
                    console.log(__filename + ': insertReviewImagesSqlQuery * error: ', error)
                    connection.release()
                    return response(error, null)
                }
                console.log(__filename + ': insertReviewImagesSqlQuery * response: ', results)
                connection.release()
                response(null, results)
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, 'database error' + error.statusCode + error.message)
    }
}

/* insert course images query */
Images.insertCourseImages = function([setImageArray], response) {
    try {
        db((error, connection) => {
            const insertCourseImagesSqlQuery = 'INSERT INTO course_images (courseNumber, originalImageName, savedImageName, mimetype, imageSize) VALUES (?)'
            connection.query(insertCourseImagesSqlQuery, [setImageArray], function(error, results) {
                if (error) {
                    console.log(__filename + ': insertCourseImagesSqlQuery * error: ', error)
                    connection.release()
                    return response(error, null)
                }
                console.log(__filename + ': insertCourseImagesSqlQuery * response: ', results)
                connection.release()
                response(null, results)
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, 'database error' + error.statusCode + error.message)
    }
}

module.exports= Images;