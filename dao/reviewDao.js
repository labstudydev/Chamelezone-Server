/* ==================== START modules ==================== */

const { ErrorHandler }      = require('../costomModules/customError')
const db                    = require('../config/db')
const Images                = require('../dao/imagesDao')

/* ==================== END modules ==================== */

var Review = function(review) {

}

Review.insertReview = function([placeNumber, content, setImagesValues], response){
    try {
        console.log("toString : " + placeNumber, content, setImagesValues)
        db((error, connection) => {
            connection.beginTransaction(function(error) {
                if (error) {
                    response(error, null)
                }
                
                const insertReviewSqlQuery = 'INSERT INTO review (memberNumber, placeNumber, content) VALUES (?, ?, ?)'
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
                            console.log('Transaction Success !!!');
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
            let selectAllReviewSqlQuery = 'select reviewNumber, placeNumber, memberNumber, content, regiDate from review'
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

// 회원의 리뷰 목록 - 이거 일단 됬고 ok
Review.selectByUser = function([memberNumber], response) {
    try {
        db((error, connection) => {
            let selectByUserSqlQuery = `SELECT R.reviewNumber, R.memberNumber, R.placeNumber, R.content, R.regiDate, P.name, ` + 
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

// 나의 리뷰에서 리뷰선택시 리뷰 상세화면 - 이거 일단 됬고2 ok
Review.selectByReview = function([placeNumber, reviewNumber], response) {
    try {
        db((error, connection) => {
            let selectByReviewSqlQuery = `SELECT R.reviewNumber, R.memberNumber, P.placeNumber, R.content, R.regiDate, P.name, ` + 
                                            `GROUP_CONCAT(RI.imageNumber separator ',') AS 'imageNumber', ` + 
                                            `GROUP_CONCAT(RI.originalImageName separator ',') AS 'originalImageName', ` + 
                                            `GROUP_CONCAT(RI.savedImageName separator ',') AS 'savedImageName' ` + 
                                            `FROM review R ` + 
                                            `LEFT JOIN place P ON P.placeNumber = R.placeNumber ` + 
                                            `LEFT JOIN review_images RI ON RI.reviewNumber = R.reviewNumber ` + 
                                            `WHERE P.placeNumber && R.reviewNumber = ? ` + 
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

Review.selectByPlace = function([placeNumber], response) {
    try {
        db((error, connection) => {
            let selectByPlaceSqlQuery = "select R.reviewNumber, R.memberNumber, P.placeNumber, R.content, R.regiDate, " +
                                        "group_concat(I.imageNumber separator ',') AS 'imageNumber', " +
                                        "group_concat(I.originalImageName separator ',') AS 'originalImageName', " +
                                        "group_concat(I.savedImageName separator ',') AS 'savedImageName' " +
                                        "from review R " +
                                        "left join place P on R.placeNumber = P.placeNumber " +
                                        "left join review_images I on R.reviewNumber = I.reviewNumber " +
                                        "where R.placeNumber = ? " +
                                        "group by R.reviewNumber"
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

module.exports = Review;