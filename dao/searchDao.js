/* ==================== START modules ==================== */

const db            = require('../config/db');
const { ErrorHandler, handleError } = require('../costomModules/customError')

/* ==================== END modules ==================== */

var Search = function(search) {

}

Search.searchByName = function(name, response, next) {
    try {
        db((error, connection) => {
            let sqlQuery = "SELECT p.placeNumber, p.name, p.address, p.latitude, p.longitude, group_concat(k.name separator '|') AS 'keywordName' " + 
                                "FROM place p, place_has_keyword phk, keyword k " + 
                                "WHERE p.placeNumber = phk.placeNumber AND phk.keywordNumber = k.keywordNumber AND p.name like ?"
            connection.query(sqlQuery, '%' + name + '%', function(error, results){
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