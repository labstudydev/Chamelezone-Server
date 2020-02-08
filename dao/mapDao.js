/* ==================== START modules ==================== */

const { ErrorHandler }      = require('../costomModules/customError')
const db                    = require('../config/db');

/* ==================== END modules ==================== */

var Map = function(map) {

}

Map.selectPlaceByName = function(name, response) {
    try {
        db((error, connection) => {
            let selectPlaceByNameSqlQuery = "SELECT p.placeNumber, p.name, p.address, p.latitude, p.longitude, group_concat(k.name separator ', ') AS 'keywordName' " + 
                                            "FROM place p, place_has_keyword phk, keyword k " + 
                                            "WHERE p.placeNumber = phk.placeNumber AND phk.keywordNumber = k.keywordNumber AND p.name like ? " +
                                            "GROUP BY p.placeNumber"
            connection.query(selectPlaceByNameSqlQuery, '%' + name + '%', function(error, results) {
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

module.exports = Map;