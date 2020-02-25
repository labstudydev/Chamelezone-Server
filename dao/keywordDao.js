/* ==================== START modules ==================== */

const db            = require('../config/db')
const { ErrorHandler, handleError } = require('../costomModules/customError')

/* ==================== END modules ==================== */

var Keyword = function(keyword) {
    this.keywordNumber = keyword.keywordNumber
    this.name = keyword.name
}

Keyword.selectAllKeyword = function(response) {
    try {
        db((error, connection) => {
            const keywordSqlQuery = 'SELECT keywordNumber, name FROM keyword'
            connection.query(keywordSqlQuery, function(error, results) {
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

/* insert place has keyword query */
Keyword.insertPlaceKeyword = function([setKeywordNameValues], response) {
    try {
        db((error, connection) => {
            const placeHasKeywordSqlQuery = 'INSERT INTO place_has_keyword (`placeNumber`, `keywordNumber`) VALUES ?'
            connection.query(placeHasKeywordSqlQuery, [setKeywordNameValues], function(error, results) {
                if (error) {
                    console.log(__filename + ': placeHasKeywordSqlQuery * error: ', error)
                    connection.release()
                    return response(error, null)
                }
                console.log(__filename + ': placeHasKeywordSqlQuery * response: ', results)
                connection.release()
                response(null, results)
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, 'database error' + error.statusCode + error.message)
    }
}

module.exports = Keyword