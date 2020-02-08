/* ==================== START modules ==================== */

const { ErrorHandler }      = require('../costomModules/customError')
const db                    = require('../config/db');

/* ==================== END modules ==================== */

var Search = function(search) {

}

// 장소명으로 검색
Search.selectByPlaceName = function(name, response) {
    try {
        db((error, connection) => {
            let selectByPlaceNameSqlQuery = "SELECT p.placeNumber, p.name, p.address, p.latitude, p.longitude, group_concat(k.name separator '|') AS 'keywordName' " + 
                                            "FROM place p, place_has_keyword phk, keyword k " + 
                                            "WHERE p.placeNumber = phk.placeNumber AND phk.keywordNumber = k.keywordNumber AND p.name like ? " +
                                            "GROUP BY p.placeNumber"
            connection.query(selectByPlaceNameSqlQuery, '%' + name + '%', function(error, results) {
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

// 지역명으로 검색
Search.selectByAreaName = function(name, response) {
    try {
        db((error, connection) => {
            let selectByAreaNameSqlQuery = "SELECT p.placeNumber, p.name, p.address, p.latitude, p.longitude, group_concat(k.name separator '|') AS 'keywordName' " + 
                                            "FROM place p, place_has_keyword phk, keyword k " + 
                                            "WHERE p.placeNumber = phk.placeNumber AND phk.keywordNumber = k.keywordNumber AND p.address like ? " +
                                            "GROUP BY p.placeNumber"
            connection.query(selectByAreaNameSqlQuery, '%' + name + '%', function(error, results) {
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

// 키워드명으로 검색
Search.selectByKeywordName = function(name, response) {
    try {
        db((error, connection) => {
            let selectByKeywordNameSqlQuery = "SELECT p.placeNumber, p.name, p.address, p.latitude, p.longitude, group_concat(k.name separator '|') AS 'keywordName' " + 
                                                "FROM place p, place_has_keyword phk, keyword k " + 
                                                "WHERE p.placeNumber = phk.placeNumber AND phk.keywordNumber = k.keywordNumber AND k.name like ? " +
                                                "GROUP BY p.placeNumber"
            connection.query(selectByKeywordNameSqlQuery, '%' + name + '%', function(error, results) {
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

module.exports = Search;