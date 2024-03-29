const { ErrorHandler }      = require('../../costomModules/customError')
const db                    = require('../../config/db')

var Search = function(search) { }

Search.selectByPlaceName = function(name, response) {
    try {
        db((error, connection) => {
            let selectByPlaceNameSqlQuery = `SELECT P.placeNumber, P.name, P.address, P.addressDetail, P.latitude, P.longitude, A.keywordName, ` +
                                            `GROUP_CONCAT(PI.imageNumber SEPARATOR ',') AS 'imageNumber', ` +
                                            `GROUP_CONCAT(PI.savedImageName SEPARATOR ',') AS 'savedImageName' ` +
                                            `FROM place P ` +
                                            `LEFT JOIN place_images PI ON PI.placeNumber = P.placeNumber ` +
                                            `LEFT JOIN (SELECT PHK.placeNumber, ` +
                                            `            GROUP_CONCAT(K.keywordNumber SEPARATOR ',')  AS 'keywordNumber', ` +
                                            `            GROUP_CONCAT(K.name SEPARATOR ',')  AS 'keywordName' ` +
                                            `            FROM place_has_keyword PHK ` +
                                            `            LEFT JOIN keyword K ON K.keywordNumber = PHK.keywordNumber ` +
                                            `            GROUP BY PHK.placeNumber ` +
                                            `            ORDER BY keywordNumber DESC) A ON A.placeNumber = P.placeNumber ` +
                                            `WHERE REPLACE(name,' ','') LIKE ? ` +
                                            `GROUP BY P.placeNumber`
            connection.query(selectByPlaceNameSqlQuery, '%' + name + '%', function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

Search.selectByAreaName = function([name], response) {
    try {
        db((error, connection) => {
            let selectByAreaNameSqlQuery = `SELECT P.placeNumber, P.name, P.address, P.addressDetail , P.latitude, P.longitude, A.keywordName, ` +
                                            `GROUP_CONCAT(PI.imageNumber SEPARATOR ',') AS 'imageNumber', ` +
                                            `GROUP_CONCAT(PI.savedImageName SEPARATOR ',') AS 'savedImageName' ` +
                                            `FROM place P ` +
                                            `LEFT JOIN place_images PI ON PI.placeNumber = P.placeNumber ` +
                                            `LEFT JOIN (SELECT PHK.placeNumber, ` +
                                            `            GROUP_CONCAT(K.keywordNumber SEPARATOR ',')  AS 'keywordNumber', ` +
                                            `            GROUP_CONCAT(K.name SEPARATOR ',')  AS 'keywordName' ` +
                                            `            FROM place_has_keyword PHK ` +
                                            `            LEFT JOIN keyword K ON K.keywordNumber = PHK.keywordNumber ` +
                                            `            GROUP BY PHK.placeNumber ` +
                                            `            ORDER BY keywordNumber DESC) A ON A.placeNumber = P.placeNumber ` +
                                            `WHERE REPLACE(address,' ','') LIKE ? OR REPLACE(addressDetail,' ','') LIKE ? ` +
                                            `GROUP BY P.placeNumber`
            connection.query(selectByAreaNameSqlQuery, ['%' + name + '%', '%' + name + '%'], function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

Search.selectByKeywordName = function(name, response) {
    try {
        db((error, connection) => {
            let selectByKeywordNameSqlQuery = `SELECT P.placeNumber, P.name, P.address, P.addressDetail, P.latitude, P.longitude, A.keywordName, ` +
                                                `GROUP_CONCAT(PI.imageNumber SEPARATOR ',') AS 'imageNumber', ` +
                                                `GROUP_CONCAT(PI.savedImageName SEPARATOR ',') AS 'savedImageName' ` +
                                                `FROM place P ` +
                                                `LEFT JOIN place_images PI ON PI.placeNumber = P.placeNumber ` +
                                                `LEFT JOIN (SELECT PHK.placeNumber, ` +
                                                `            GROUP_CONCAT(K.keywordNumber SEPARATOR ',')  AS 'keywordNumber', ` +
                                                `            GROUP_CONCAT(K.name SEPARATOR ',')  AS 'keywordName' ` +
                                                `            FROM place_has_keyword PHK ` +
                                                `            LEFT JOIN keyword K ON K.keywordNumber = PHK.keywordNumber ` +
                                                `            GROUP BY PHK.placeNumber ` +
                                                `            ORDER BY keywordNumber DESC) A ON A.placeNumber = P.placeNumber ` +
                                                `WHERE REPLACE(keywordName,',','') LIKE ? ` +
                                                `GROUP BY P.placeNumber`
            connection.query(selectByKeywordNameSqlQuery, '%' + name + '%', function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

module.exports = Search