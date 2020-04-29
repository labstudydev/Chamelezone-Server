const { ErrorHandler }      = require('../../costomModules/customError')
const db                    = require('../../config/db')

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
                        connection.release()
                        return connection.rollback(function() {
                            response(error, null)
                        })
                    }

                    let reviewNumber = results.insertId
                    for (var i in setImagesValues) {
                        setImagesValues[i].unshift(reviewNumber)
                    }

                    const insertReviewImagesSqlQuery = 'INSERT INTO review_images (reviewNumber, originalImageName, savedImageName, mimetype, imageSize) VALUES ?'
                    connection.query(insertReviewImagesSqlQuery, [setImagesValues], function(error, results) {
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
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

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
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

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
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

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
                                            `GROUP BY R.reviewNumber ` +
                                            `ORDER BY R.reviewNumber DESC`
            connection.query(selectByPlaceSqlQuery, [placeNumber], function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
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
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

Review.selectReviewDuplicateCheck = function([memberNumber, placeNumber, content], response) {
    try {
        db((error, connection) => {
            const selectReviewDuplicateCheckSqkQyery = `SELECT reviewNumber, memberNumber, placeNumber, content FROM review where memberNumber = ? AND placeNumber = ? AND content =?`
            connection.query(selectReviewDuplicateCheckSqkQyery, [memberNumber, placeNumber, content], function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

Review.updateReview = function([content, reviewNumber], response) {
    try {
        db((error, connection) => {
            const updateReviewSqlQuery = `UPDATE review SET content = ? WHERE reviewNumber =?`
            connection.query(updateReviewSqlQuery, [content, reviewNumber], function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

Review.selectReviewImages = function([reviewNumber], response) {
    try {
        db((error, connection) => {
            const selectReviewImagesSqlQuery = `SELECT imageNumber, reviewNumber, originalImageName, savedImageName, mimetype, imageSize FROM review_images WHERE reviewNumber = ?`
            connection.query(selectReviewImagesSqlQuery, [reviewNumber], function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

Review.insertReviewImages = function([setImagesValues], response) {
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

Review.deleteReviewImages = function([reviewNumber, imageNumber], response) {
    try {
        db((error, connection) => {
            const deleteReviewImagesSqlQuery = `DELETE FROM review_images WHERE reviewNumber in (?) AND imageNumber in (?)`
            connection.query(deleteReviewImagesSqlQuery, [reviewNumber, imageNumber], function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

module.exports = Review