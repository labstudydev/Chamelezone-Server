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
            // const selectOneCourseSqlQuery = `select JSON_ARRAY(C.courseNumber, C.title, C.content, CI.savedImageName) AS course, B.placeNumber, B.placeName, B.placeAddress, B.keywordName ` +
            // `from course C ` +
            // `LEFT JOIN course_images CI ON CI.courseNumber = C.courseNumber ` +
            // `left join (select CHP.courseNumber, ` +
            // `            group_concat(CHP.placeNumber separator ',') as placeNumber, ` +
            // `            group_concat(P.name separator ',') as placeName, ` +
            // `            group_concat(P.address separator ',') as placeAddress, ` +
            // `            group_concat(A.keywordName separator '|') as keywordName ` +
            // `            from course_has_place CHP ` +
            // `           left join place P on P.placeNumber = CHP.placeNumber ` +
            // `            left join (select PHK.placeNumber, GROUP_CONCAT(K.keywordNumber SEPARATOR ',') AS 'keywordNumber', JSON_OBJECT("keywordName", JSON_ARRAY(GROUP_CONCAT(K.name SEPARATOR ','))) AS 'keywordName' ` +
            // `                    FROM place_has_keyword PHK ` +
            // `                    JOIN keyword K ON K.keywordNumber = PHK.keywordNumber ` +
            // `                    GROUP BY PHK.placeNumber) A on A.placeNumber = CHP.placeNumber ` +
            // `            group by courseNumber) B on B.courseNumber = C.courseNumber ` +
            // `where C.courseNumber = ? ` +
            // `group by C.courseNumber`

            //이게원래
            // const selectOneCourseSqlQuery = `select C.courseNumber, C.title, C.content, CI.savedImageName, B.placeNumber, B.placeName, B.placeAddress, B.keywordName ` +
            //                                 `from course C ` +
            //                                 `LEFT JOIN course_images CI ON CI.courseNumber = C.courseNumber ` +
            //                                 `left join (select CHP.courseNumber, ` +
            //                                 `            group_concat(CHP.placeNumber separator ',') as placeNumber, ` +
            //                                 `            group_concat(P.name separator ',') as placeName, ` +
            //                                 `            group_concat(P.address separator ',') as placeAddress, ` +
            //                                 `            group_concat(A.keywordName separator '|') as keywordName ` +
            //                                 `            from course_has_place CHP ` +
            //                                 `           left join place P on P.placeNumber = CHP.placeNumber ` +
            //                                 `            left join (select PHK.placeNumber, GROUP_CONCAT(K.keywordNumber SEPARATOR ',') AS 'keywordNumber', GROUP_CONCAT(K.name SEPARATOR ',') AS 'keywordName' ` +
            //                                 `                    FROM place_has_keyword PHK ` +
            //                                 `                    JOIN keyword K ON K.keywordNumber = PHK.keywordNumber ` +
            //                                 `                    GROUP BY PHK.placeNumber) A on A.placeNumber = CHP.placeNumber ` +
            //                                 `            group by courseNumber) B on B.courseNumber = C.courseNumber ` +
            //                                 `where C.courseNumber = ? ` +
            //                                 `group by C.courseNumber`

            const selectOneCourseSqlQuery = `select C.courseNumber, C.title, C.content, CI.savedImageName, B.placeNumber, B.placeName, B.placeAddress, B.keywordName ` +
                                            `from course C ` +
                                            `LEFT JOIN course_images CI ON CI.courseNumber = C.courseNumber ` +
                                            `left join (select CHP.courseNumber, ` +
                                            `            group_concat(DISTINCT CHP.placeNumber separator ',') as placeNumber, ` +
                                            `            group_concat(DISTINCT P.name separator ',') as placeName, ` +
                                            `            group_concat(DISTINCT P.address separator ',') as placeAddress, ` +
                                            `            group_concat(DISTINCT A.keywordName separator '|') as keywordName ` +
                                            `            from course_has_place CHP ` +
                                            `           left join place P on P.placeNumber = CHP.placeNumber ` +
                                            `            left join (select DISTINCT PHK.placeNumber, GROUP_CONCAT(DISTINCT K.keywordNumber SEPARATOR ',') AS 'keywordNumber', GROUP_CONCAT(DISTINCT K.name SEPARATOR ',') AS 'keywordName' ` +
                                            `                        FROM place_has_keyword PHK ` +
                                            `                        JOIN keyword K ON K.keywordNumber = PHK.keywordNumber ` +
                                            `                        GROUP BY PHK.placeNumber) A on A.placeNumber = CHP.placeNumber ` +
                                            `                        group by CHP.placeNumber) B on B.courseNumber = C.courseNumber ` +                      
                                            `where C.courseNumber = ?`

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