/* ==================== START modules ==================== */

const { ErrorHandler }      = require('../costomModules/customError')
const db                    = require('../config/db');

/* ==================== END modules ==================== */

var Review = function(review) {
    this.content = review.content
}

Review.insertReview = function([content], response){
    try {
        db((error, connection) => {
            let insertReviewSqlQuery = 'INSERT INTO review (content) VALUES (?)'
            connection.query(insertReviewSqlQuery, [content], function(error, results) {
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