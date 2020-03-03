/* ==================== START modules ==================== */

const { ErrorHandler }      = require('../costomModules/customError')
const db                    = require('../config/db')
const Images                = require('../dao/imageDao')

/* ==================== END modules ==================== */

var Review = function(review) { }

Review.insertReview = function([placeNumber, memberNumber, content, setImagesValues], response) {
    try {
        db((error, connection) => {
            connection.beginTransaction(function(error) {
                if (error) {
                    response(error, null)
                }
                
                const insertReviewSqlQuery = `INSERT INTO review (memberNumber, placeNumber, content) VALUES (?, ?, ?)`
                connection.query(insertReviewSqlQuery, [memberNumber, placeNumber, content], function(error, results) {
                    if (error) {
                        return connection.rollback(function() {
                            response(error, null)
                        })
                    }
                    
                    console.log(__filename + ': insertReviewSqlQuery * response: ', results)
                    connection.release()

                    let reviewNumber = results.insertId
                    for (var i in setImagesValues) {
                        setImagesValues[i].unshift(reviewNumber)
                    }

                    console.log(setImagesValues)

                    // images insert query
                    Images.insertReviewImages([setImagesValues], function(error, results) {
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
                    })  // Images.insertReviewImages()
                })  // insertReviewSqlQuery()
            })  // beginTransaction()
        })  // db connection()
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

Review.selectAllReview = function(response) {
    try {
        db((error, connection) => {
            const selectAllReviewSqlQuery = `SELECT reviewNumber, placeNumber, memberNumber, content, DATE_FORMAT(regiDate, '%Y-%m-%d') as regiDate FROM review`
            connection.query(selectAllReviewSqlQuery, function(error, results) {
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
        throw new ErrorHandler(500, error)
    }
}

// 회원의 리뷰 목록(회원의 리뷰 목록 조회) - 이거 일단 됬고 ok
Review.selectByUser = function([memberNumber], response) {
    try {
        db((error, connection) => {
            const selectByUserSqlQuery = `SELECT R.reviewNumber, R.memberNumber, R.placeNumber, R.content, DATE_FORMAT(R.regiDate, '%Y-%m-%d') as regiDate, P.name, ` + 
                                            `GROUP_CONCAT(PI.imageNumber separator ',') AS 'imageNumber', ` + 
                                            `GROUP_CONCAT(PI.originalImageName separator ',') AS 'originalImageName', ` + 
                                            `GROUP_CONCAT(PI.savedImageName separator ',') AS 'savedImageName' ` + 
                                            `FROM review R ` + 
                                            `LEFT JOIN place P ON P.placeNumber = R.placeNumber ` + 
                                            `LEFT JOIN place_images PI ON PI.placeNumber = R.placeNumber ` + 
                                            `WHERE R.memberNumber = ? ` + 
                                            `GROUP BY R.reviewNumber`
            connection.query(selectByUserSqlQuery, [memberNumber], function(error, results) {
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
        throw new ErrorHandler(500, error)
    }
}

// 나의 리뷰에서 리뷰선택시 리뷰 상세화면(특정 리뷰 조회) - 이거 일단 됬고2 ok
Review.selectByReview = function([placeNumber, reviewNumber], response) {
    try {
        db((error, connection) => {
            const selectByReviewSqlQuery = `SELECT R.reviewNumber, R.memberNumber, P.placeNumber, R.content, DATE_FORMAT(R.regiDate, '%Y-%m-%d') as regiDate, P.name, ` + 
                                            `GROUP_CONCAT(RI.imageNumber separator ',') AS 'imageNumber', ` + 
                                            `GROUP_CONCAT(RI.originalImageName separator ',') AS 'originalImageName', ` + 
                                            `GROUP_CONCAT(RI.savedImageName separator ',') AS 'savedImageName' ` + 
                                            `FROM review R ` + 
                                            `LEFT JOIN place P ON P.placeNumber = R.placeNumber ` + 
                                            `LEFT JOIN review_images RI ON RI.reviewNumber = R.reviewNumber ` + 
                                            `WHERE P.placeNumber = ? && R.reviewNumber = ? ` + 
                                            `GROUP BY R.reviewNumber`
            connection.query(selectByReviewSqlQuery, [placeNumber, reviewNumber], function(error, results) {
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
        throw new ErrorHandler(500, error)
    }
}

// 장소의 리뷰 목록 조회
Review.selectByPlace = function([placeNumber], response) {
    try {
        db((error, connection) => {
            const selectByPlaceSqlQuery = `SELECT R.reviewNumber, R.memberNumber, P.placeNumber, R.content, DATE_FORMAT(R.regiDate, '%Y-%m-%d') as regiDate, M.nickName, ` +
                                            `GROUP_CONCAT(RI.imageNumber SEPARATOR ',') AS 'imageNumber', ` +
                                            `GROUP_CONCAT(RI.originalImageName SEPARATOR ',') AS 'originalImageName', ` +
                                            `GROUP_CONCAT(RI.savedImageName SEPARATOR ',') AS 'savedImageName' ` +
                                            `FROM review R ` +
                                            `LEFT JOIN place P ON R.placeNumber = P.placeNumber ` +
                                            `LEFT JOIN review_images RI ON R.reviewNumber = RI.reviewNumber ` +
                                            `LEFT JOIN member M ON R.memberNumber = M.memberNumber ` +
                                            `WHERE R.placeNumber = ? ` +
                                            `GROUP BY R.reviewNumber`
            connection.query(selectByPlaceSqlQuery, [placeNumber], function(error, results) {
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
        throw new ErrorHandler(500, error)
    }
}

Review.deleteReview = function([memberNumber, placeNumber, reviewNumber], response) {
    try {
        db((error, connection) => {
            const deleteReviewSqlQuery = `DELETE FROM review WHERE memberNumber = ? AND placeNumber = ? AND reviewNumber = ?`
            connection.query(deleteReviewSqlQuery, [memberNumber, placeNumber, reviewNumber], function(error, results) {
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
        throw new ErrorHandler(500, error)
    }
}

module.exports = Review