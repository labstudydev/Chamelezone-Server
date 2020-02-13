/* ==================== START modules ==================== */

const { ErrorHandler }      = require('../costomModules/customError')
const db                    = require('../config/db')
const Images                = require('./imageDao')

/* ==================== END modules ==================== */

var Course = function(course) {

};

Course.insertCourse = function([memberNumber, title, content, setImagesValues, setPlaceNumberValues], response) {
    try {
        db((error, connection) => {
            connection.beginTransaction(function(error) {
                if (error) {
                    reesponse(error, null)
                }
            
                const insertCourseSqlQuery = `INSERT INTO course (memberNumber, title, content) VALUES (?, ?, ?)`
                connection.query(insertCourseSqlQuery, [memberNumber, title, content], function(error, results) {
                    if (error) {
                        return connection.rollback(function() {
                            response(error, null)
                        })
                    }
                    
                    console.log(__filename + ': insertCourseSqlQuery * response: ', results)
                    connection.release()

                    let courseNumber = results.insertId
                    for (var i in setImagesValues) {
                        setImagesValues[i].unshift(courseNumber)
                    }
                    for (var j in setPlaceNumberValues) {
                        setPlaceNumberValues[j].unshift(courseNumber)
                    }

                    console.log(setImagesValues)
                    console.log(setPlaceNumberValues)

                    Images.insertCourseImages([setImagesValues], function(error, results) {
                        if (error) {
                            return connection.rollback(function() {
                                response(error, null)
                            })
                        }

                        const insertCourseHasPlaceSqlQuery = `INSERT INTO course_has_place (courseNumber, placeNumber) VALUES ?`
                        connection.query(insertCourseHasPlaceSqlQuery, [setPlaceNumberValues], function(error, results) {
                            if (error) {
                                return connection.rollback(function() {
                                    response(error, null)
                                })
                            }

                            connection.commit(function(error) {
                                if (error) {
                                    return connection.rollback(function() {
                                        response(error, null)
                                    })
                                }

                                console.log('Transaction Success !!!');
                                response(null, results)
                            })  // commit()
                        })  // insertCourseHasPlaceSqlQuery()
                    })  // Images.insertCourseImages()
                })  // insertCourseSqlQuery()
            })  // beginTransaction()
        })  // db connection()
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

module.exports = Course;