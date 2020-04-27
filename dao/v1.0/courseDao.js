const { ErrorHandler }      = require('../../costomModules/customError')
const db                    = require('../../config/db')
const Images                = require('./imageDao')
const Step					= require('step')

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
                        connection.release()
                        return connection.rollback(function() {
                            response(error, null)
                        })
                    }

                    let courseNumber = results.insertId
                    
                    for (var j in setPlaceNumberValues) {
                        setPlaceNumberValues[j].unshift(courseNumber)
                    }
                    setImageArray.unshift(courseNumber)

                    const insertCourseImagesSqlQuery = 'INSERT INTO course_images (courseNumber, originalImageName, savedImageName, mimetype, imageSize) VALUES (?)'
                    connection.query(insertCourseImagesSqlQuery, [setImageArray], function(error, results) {
                        if (error) {
                            connection.release()
                            return connection.rollback(function() {
                                response(error, null)
                            })
                        }

                        const insertCourseHasPlaceSqlQuery = `INSERT INTO course_has_place (courseNumber, placeNumber) VALUES ?`
                        connection.query(insertCourseHasPlaceSqlQuery, [setPlaceNumberValues], function(error, results) {
                            if (error) {
                                connection.release()
                                return connection.rollback(function() {
                                    response(error, null)
                                })
                            }

                            connection.commit(function(error) {
                                if (error) {
                                    connection.release()
                                    return connection.rollback(function() {
                                        response(error, null)
                                    })
                                }
                                connection.release()
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
            const selectOneCourseSqlQuery = `SELECT CHP.coursePlaceNumber, CHP.courseNumber, CHP.placeNumber, COURSE.memberNumber, COURSE.nickName, COURSE.title, COURSE.content, DATE_FORMAT(COURSE.regiDate, '%Y-%m-%d') AS 'regiDate', ` +
                                                    `PLACE.placeName, PLACE.address, PLACE.addressDetail, CI.imageNumber AS 'courseImageNumber', CI.savedImageName AS 'courseImage', PLACE.savedImageName AS 'placeImage', PLACE.keywordName AS 'keywordName' ` +
                                            `FROM course_has_place CHP ` +
                                            `LEFT JOIN (SELECT C.courseNumber, C.memberNumber, C.title, C.content, C.regiDate, M.nickName ` +
                                            `            FROM course C ` +
                                            `            LEFT JOIN member M ON M.memberNumber = C.memberNumber) COURSE ON COURSE.courseNumber = CHP.courseNumber ` +
                                            `LEFT JOIN course_images CI ON CI.courseNumber = CHP.courseNumber ` +
                                            `LEFT JOIN (SELECT PHK.placeNumber, P.name AS 'placeName', P.address, P.addressDetail, PI.savedImageName, GROUP_CONCAT(DISTINCT K.name separator ',') AS 'keywordName' ` +
                                            `           FROM place_has_keyword PHK ` +
                                            `           LEFT JOIN place P ON P.placeNumber = PHK.placeNumber ` +
                                            `           LEFT JOIN place_images PI ON PI.placeNumber = PHK.placeNumber ` +
                                            `           LEFT JOIN keyword K ON K.keywordNumber = PHK.keywordNumber ` +
                                            `           GROUP BY PHK.placeNumber) PLACE ON PLACE.placeNumber = CHP.placeNumber ` +
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

Course.selectCourseDuplicateCheck = function([memberNumber, title, content], response) {
    try {
        db((error, connection) => {
            const selectCourseDuplicateCheckSqkQyery = `SELECT memberNumber, title, content FROM course WHERE memberNumber = ? AND title = ? AND content = ?`
            connection.query(selectCourseDuplicateCheckSqkQyery, [memberNumber, title, content], function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

Course.updateCourse = function(request, response) {
    try {
        db((error, connection) => {
            const updateCourseSqlQuery = `UPDATE course SET title = ?, content = ? WHERE courseNumber = ? AND memberNumber = ?`
            connection.query(updateCourseSqlQuery, request, function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

Course.updateCourseImage = function([originalImageName, savedImageName, mimetype, imageSize, courseNumber, imageNumber], response) {
    try {
        db((error, connection) => {
            const updateCourseImageSqlQuery = `UPDATE course_images SET originalImageName = ?, savedImageName = ?, mimetype = ?, imageSize = ?  WHERE courseNumber = ? AND imageNumber = ?`
            connection.query(updateCourseImageSqlQuery, [originalImageName, savedImageName, mimetype, imageSize, courseNumber, imageNumber], function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

Course.selectCheckCourse = function(courseNumber, response) {
    try {
        db((error, connection) => {
            const selectCheckCourseSqlQuery = `SELECT courseNumber, memberNumber, title, content FROM course WHERE courseNumber = ?`
            connection.query(selectCheckCourseSqlQuery, courseNumber, function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error) 
    }
}

Course.selectCheckCourseImage = function(courseNumber, response) {
    try {
        db((error, connection) => {
            const selectCheckCourseImageSqlQuery = `SELECT imageNumber, courseNumber, originalImageName, savedImageName, mimetype, imageSize FROM course_images WHERE courseNumber = ?`
            connection.query(selectCheckCourseImageSqlQuery, courseNumber, function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error) 
    }
}

Course.selectCheckCourseHasPlace = function(courseNumber, response) {
    try {
        db((error, connection) => {
            const selectCheckCourseHasPlaceSqlQuery = `SELECT coursePlaceNumber, courseNumber, placeNumber FROM course_has_place WHERE courseNumber = ?`
            connection.query(selectCheckCourseHasPlaceSqlQuery, courseNumber, function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

Course.updateCourseTransaction = function([title, content, courseNumber, memberNumber, originalImageName, savedImageName, mimetype, imageSize, imageNumber], response) {
    try {
        db((error, connection) => {
            connection.beginTransaction(function(error) {
                if (error) {
                    connection.release()
                    reesponse(error, null)
                }
            
                const updateCourseSqlQuery = `UPDATE course SET title = ?, content = ? WHERE courseNumber = ? AND memberNumber = ?`
                connection.query(updateCourseSqlQuery, [title, content, courseNumber, memberNumber], function(error, results) {
                    if (error) {
                        connection.release()
                        return connection.rollback(function() {
                            response(error, null)
                        })
                    }

                    const updateCourseImageSqlQuery = `UPDATE course_images SET originalImageName = ?, savedImageName = ?, mimetype = ?, imageSize = ?  WHERE courseNumber = ? AND imageNumber = ?`
                    connection.query(updateCourseImageSqlQuery, [originalImageName, savedImageName, mimetype, imageSize, courseNumber, imageNumber], function(error, results) {
                        if (error) {
                            connection.release()
                            return connection.rollback(function() {
                                response(error, null)
                            })
                        }
                        
                        connection.commit(function(error) {
                            if (error) {
                                connection.release()
                                return connection.rollback(function() {
                                    response(error, null)
                                })
                            }
                            response(null, results)
                            connection.release()
                        })  // commit()
                    })
                })
            })  // beginTransaction()
        })  // db connection()
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

Course.updateCourseHasPlace = function([placeNumber, courseNumber, coursePlaceNumber], response) {
    try {
        db((error, connection) => {
            const updateCourseHasPlaceSqlQuery = `UPDATE course_has_place SET placeNumber = ?  WHERE courseNumber = ? AND coursePlaceNumber = ?`
            connection.query(updateCourseHasPlaceSqlQuery, [placeNumber, courseNumber, coursePlaceNumber], function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

Course.deleteCourseHasPlace = function([coursePlaceNumberFlag], response) {
    try {
        db((error, connection) => {
            const deleteCourseHasPlaceSqlQuery = `DELETE FROM course_has_place WHERE coursePlaceNumber = ?`
            connection.query(deleteCourseHasPlaceSqlQuery, [coursePlaceNumberFlag], function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

Course.insertCourseHasPlace = function([courseNumber, coursePlaceNumberFlag], response) {
    try {
        db((error, connection) => {
            const insertCourseHasPlaceSqlQuery = `INSERT INTO course_has_place (courseNumber, placeNumber) VALUES (?, ?)`
            connection.query(insertCourseHasPlaceSqlQuery, [courseNumber, coursePlaceNumberFlag], function(error, results) {
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