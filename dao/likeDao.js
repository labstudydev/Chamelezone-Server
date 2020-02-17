/* ==================== START modules ==================== */

const { ErrorHandler }      = require('../costomModules/customError')
const db                    = require('../config/db')

/* ==================== END modules ==================== */

var Like = function(like) { }

Like.insertLike = function([placeNumber, memberNumber], response) {
    try {
        db((error, connection) => {
            const insertLikeSqlQuery = `INSERT INTO like_history (placeNumber, memberNumber) VALUES (?, ?)`
            connection.query(insertLikeSqlQuery, [placeNumber, memberNumber], function(error, results) {
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

Like.deleteLike = function([likeNumber, placeNumber, memberNumber], response) {
    try {
        db((error, connection) => {
            const deleteLikeSqlQuery = `DELETE FROM like_history WHERE likeNumber = ? AND placeNumber = ? AND memberNumber = ?`
            connection.query(deleteLikeSqlQuery, [likeNumber, placeNumber, memberNumber], function(error, results) {
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

module.exports = Like