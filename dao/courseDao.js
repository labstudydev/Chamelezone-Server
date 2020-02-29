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
            const selectAllCourseSqlQuery = `SELECT C.courseNumber, C.title, DATE_FORMAT(C.regiDate, '%Y-%m-%d') as regiDate, M.memberNumber, M.nickName , CI.imageNumber, CI.savedImageName ` +
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
            const selectOneCourseSqlQuery = `SELECT  CHP.courseNumber, CHP.placeNumber, C.memberNumber, C.title, C.content, DATE_FORMAT(C.regiDate, '%Y-%m-%d') AS 'course_regiDate', ` +
                                            `PLACE.place_name, PLACE.address, CI.savedImageName AS 'course_image', PLACE.savedImageName 'place_images' , PLACE.keyword_name AS keyword_name ` +
                                            `FROM course_has_place CHP ` +
                                            `inner JOIN course C ON C.courseNumber = CHP.courseNumber ` +
                                            `inner JOIN course_images CI ON CI.courseNumber = CHP.courseNumber ` +
                                            `inner JOIN (SELECT PHK.placeNumber, P.name AS 'place_name', P.address, PI.savedImageName, group_concat(DISTINCT K.name separator ',') AS 'keyword_name' ` +
                                            `   from place_has_keyword PHK ` +
                                            `   inner JOIN place P ON P.placeNumber = PHK.placeNumber ` +
                                            `   inner JOIN place_images PI ON PI.placeNumber = PHK.placeNumber ` +
                                            `   inner JOIN keyword K ON K.keywordNumber = PHK.keywordNumber ` +
                                            `   group by PHK.placeNumber) PLACE ON PLACE.placeNumber = CHP.placeNumber ` +
                                            `WHERE CHP.courseNumber = ?`
            connection.query(selectOneCourseSqlQuery,[courseNumber], function(error, results) {
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