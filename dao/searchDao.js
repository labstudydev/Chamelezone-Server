/* ==================== START modules ==================== */

const db            = require('../config/db');
const { ErrorHandler, handleError } = require('../costomModules/customError')

/* ==================== END modules ==================== */

var Search = function(search) {

}

Search.searchByName = function(name, response, next) {
    try {
        db((error, connection) => {
            connection.query("select placeNumber, name, address from place where name like ? order by placeNumber desc limit 5;", '%' + name + '%', function(error, results){
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

module.exports= Search;