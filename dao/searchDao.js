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
            let selectByPlaceNameSqlQuery = "SELECT P.placeNumber, P.name, P.address, P.latitude, P.longitude, GROUP_CONCAT(K.name SEPARATOR ',') AS 'keywordName' " + 
                                            "FROM place P, place_has_keyword PHK, keyword K " + 
                                            "WHERE P.placeNumber = PHK.placeNumber AND PHK.keywordNumber = K.keywordNumber AND P.name like ? " +
                                            "GROUP BY P.placeNumber"
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
            let selectByAreaNameSqlQuery = "SELECT P.placeNumber, P.name, P.address, P.latitude, P.longitude, GROUP_CONCAT(K.name SEPARATOR ',') AS 'keywordName' " + 
                                            "FROM place P, place_has_keyword PHK, keyword K " + 
                                            "WHERE P.placeNumber = PHK.placeNumber AND PHK.keywordNumber = K.keywordNumber AND P.address like ? " +
                                            "GROUP BY P.placeNumber"
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
            let selectByKeywordNameSqlQuery = "SELECT P.placeNumber, P.name, P.address, P.latitude, P.longitude, GROUP_CONCAT(K.name SEPARATOR ',') AS 'keywordName' " + 
                                                "FROM place P, place_has_keyword PHK, keyword K " + 
                                                "WHERE P.placeNumber = PHK.placeNumber AND PHK.keywordNumber = K.keywordNumber AND K.name like ? " +
                                                "GROUP BY P.placeNumber"
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