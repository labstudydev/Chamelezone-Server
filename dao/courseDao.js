const ErrorHandler          = require('../costomModules/customError')
const db                    = require('../config/db')
const Images                = require('./imageDao')

var Course = function(course) { }

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
                    connection.release()
                    let courseNumber = results.insertId
                    
                    for (var j in setPlaceNumberValues) {
                        setPlaceNumberValues[j].unshift(courseNumber)
                    }
                    setImageArray.unshift(courseNumber)

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
            const selectAllCourseSqlQuery = `SELECT C.courseNumber, C.title, DATE_FORMAT(C.regiDate, '%Y-%m-%d') AS regiDate, M.memberNumber, M.nickName , CI.imageNumber, CI.savedImageName ` +
                                            `FROM course C ` +
                                            `LEFT JOIN member M ON M.memberNumber = C.memberNumber ` +
                                            `LEFT JOIN course_images CI ON CI.courseNumber = C.courseNumber ` +
                                            `ORDER BY C.courseNumber desc ` +
                                            `LIMIT 50`
            connection.query(selectAllCourseSqlQuery, function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

Course.selectOneCourse = function([courseNumber], response) {
    try {
        db((error, connection) => {
            const selectOneCourseSqlQuery = `SELECT  CHP.courseNumber, CHP.placeNumber, C.memberNumber, C.title, C.content, DATE_FORMAT(C.regiDate, '%Y-%m-%d') AS 'regiDate', ` +
                                            `PLACE.placeName, PLACE.address, CI.savedImageName AS 'courseImage', PLACE.savedImageName AS 'placeImage', PLACE.keywordName AS keywordName ` +
                                            `FROM course_has_place CHP ` +
                                            `LEFT JOIN course C ON C.courseNumber = CHP.courseNumber ` +
                                            `LEFT JOIN course_images CI ON CI.courseNumber = CHP.courseNumber ` +
                                            `LEFT JOIN (SELECT PHK.placeNumber, P.name AS 'placeName', P.address, PI.savedImageName, GROUP_CONCAT(DISTINCT K.name separator ',') AS 'keywordName' ` +
                                            `   FROM place_has_keyword PHK ` +
                                            `   LEFT JOIN place P ON P.placeNumber = PHK.placeNumber ` +
                                            `   LEFT JOIN place_images PI ON PI.placeNumber = PHK.placeNumber ` +
                                            `   LEFT JOIN keyword K ON K.keywordNumber = PHK.keywordNumber ` +
                                            `   GROUP BY PHK.placeNumber) PLACE ON PLACE.placeNumber = CHP.placeNumber ` +
                                            `WHERE CHP.courseNumber = ?`
            connection.query(selectOneCourseSqlQuery, [courseNumber], function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

Course.selectAllByUser = function([memberNumber], response) {
    try {
        db((error, connection) => {
            const selectAllByUserSqlQuery = `SELECT C.courseNumber, C.memberNumber, C.title, C.content, CI.savedImageName ` +
                                            `FROM course C ` +
                                            `LEFT JOIN course_images CI ON CI.courseNumber = C.courseNumber ` +
                                            `WHERE C.memberNumber = ? ` +
                                            `ORDER BY C.courseNumber DESC`
            connection.query(selectAllByUserSqlQuery, [memberNumber], function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

Course.deleteCourse = function([courseNumber, memberNumber], response) {
    try {
        db((error, connection) => {
            const deleteCourseSqlQuery = `DELETE FROM course WHERE courseNumber = ? AND memberNumber = ?`
            connection.query(deleteCourseSqlQuery, [courseNumber, memberNumber], function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

module.exports = Course