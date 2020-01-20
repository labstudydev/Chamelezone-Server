/* ==================== START modules ==================== */

const db            = require('../config/db');
const { ErrorHandler, handleError } = require('../costomModules/customError')

/* ==================== END modules ==================== */

var Keyword = function(keyword) {
    this.keywordNumber = keyword.keywordNumber
    this.name = keyword.name
}

Keyword.readAllKeyword = function(response, next) {
    try {
        db((error, connection) => {
            connection.query("SELECT keywordNumber, name FROM keyword", function(error, results) {
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

module.exports= Keyword;