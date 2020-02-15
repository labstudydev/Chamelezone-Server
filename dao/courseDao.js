/* ==================== START modules ==================== */

const { ErrorHandler }      = require('../costomModules/customError')
const db                    = require('../config/db')
const Images                = require('./imageDao')

/* ==================== END modules ==================== */

var Course = function(course) {

}

Course.insertCourse = function([memberNumber, title, content, setImageArray, setPlaceNumberValues], response) {
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
                    
                    for (var j in setPlaceNumberValues) {
                        setPlaceNumberValues[j].unshift(courseNumber)
                    }
                    setImageArray.unshift(courseNumber)
                    
                    console.log(setImageArray)
                    console.log(setPlaceNumberValues)

                    Images.insertCourseImages([setImageArray], function(error, results) {
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

                                console.log('Transaction Success !!!')
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

Course.selectAllCourse = function(response) {
    try {
        db((error, connection) => {
            const selectAllCourseSqlQuery = `SELECT C.courseNumber, C.title, C.regiDate, M.memberNumber, M.nickName , CI.imageNumber, CI.savedImageName ` +
                                            `FROM course C ` +
                                            `LEFT JOIN member M ON M.memberNumber = C.memberNumber ` +
                                            `LEFT JOIN course_images CI ON CI.courseNumber = C.courseNumber ` +
                                            `ORDER BY C.courseNumber desc ` +
                                            `LIMIT 50`
            connection.query(selectAllCourseSqlQuery, function(error, results) {
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

Course.selectOneCourse = function([courseNumber], response) {
    try {
        db((error, connection) => {
            const selectOneCourseSqlQuery = 
            connection.query(selectOneCourseSqlQuery, function(error, results) {
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

module.exports = Course