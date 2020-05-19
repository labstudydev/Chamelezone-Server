const { ErrorHandler }      = require('../../costomModules/customError')
const db                    = require('../../config/db')

var Images = function(images) { }

Images.insertPlaceImages = function([setImagesValues], response) {
    try {
        db((error, connection) => {
            const insertPlaceImagesSqlQuery = `INSERT INTO place_images (placeNumber, originalImageName, savedImageName, mimetype, imageSize) VALUES ?`
            connection.query(insertPlaceImagesSqlQuery, [setImagesValues], function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

Images.insertReviewImages = function([setImagesValues], response) {
    try {
        db((error, connection) => {
            const insertReviewImagesSqlQuery = `INSERT INTO review_images (reviewNumber, originalImageName, savedImageName, mimetype, imageSize) VALUES ?`
            connection.query(insertReviewImagesSqlQuery, [setImagesValues], function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

Images.insertCourseImages = function([setImageArray], response) {
    try {
        db((error, connection) => {
            const insertCourseImagesSqlQuery = `INSERT INTO course_images (courseNumber, originalImageName, savedImageName, mimetype, imageSize) VALUES (?)`
            connection.query(insertCourseImagesSqlQuery, [setImageArray], function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

Images.updatePlaceImages = function([setImagesValues], response) {
    try {
        db((error, connection) => {
            const updatePlaceImagesSqlQuery = `UPDATE place_images SET originalImageName = ?, savedImageName = ?, mimetype = ?, imageSize = ? WHERE placeNumber = ?`
            connection.query(updatePlaceImagesSqlQuery, [setImagesValues], function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

module.exports = Images