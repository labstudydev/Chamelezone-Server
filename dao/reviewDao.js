/* ==================== START modules ==================== */

const { ErrorHandler }      = require('../costomModules/customError')
const db                    = require('../config/db')
const Images                = require('../dao/imagesDao')

/* ==================== END modules ==================== */

var Review = function(review) {
    this.content = review.content
}

Review.insertReview = function([content, setImagesValues], response){
    console.log("뭐고")
    try {
        db((error, connection) => {
            connection.beginTransaction(function(error) {
                if (error) {
                    response(error, null)
                }
                let insertReviewSqlQuery = 'INSERT INTO review (content) VALUES (?)'
                connection.query(insertReviewSqlQuery, [content], function(error, results) {
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
            let selectAllReviewSqlQuery = 'select reviewNumber, memberNumber, nickName, content, regiDate from review'
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

module.exports = Review;