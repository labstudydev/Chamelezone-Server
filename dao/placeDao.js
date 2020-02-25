/* ==================== START modules ==================== */

const { ErrorHandler }      = require('../costomModules/customError')
const db                    = require('../config/db')
const Keyword               = require('../dao/keywordDao')
const Images                = require('./imageDao')

/* ==================== END modules ==================== */

var Place = function(place) { }

Place.createPlace = function([memberNumber, name, address, setKeywordNameValues, openingTime1, openingTime2, openingTime3, phoneNumber, content, parseLatitude, parseLongitude, setImagesValues], response) {
    try {
        db((error, connection) => {
            connection.beginTransaction(function(error) {
                if (error) {
                    response(error, null)
                }
                const placeSqlQuery = `INSERT INTO place (memberNumber, name, address, openingTime1, openingTime2, openingTime3, phoneNumber, content, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
                connection.query(placeSqlQuery, [memberNumber, name, address, openingTime1, openingTime2, openingTime3, phoneNumber, content, parseLatitude, parseLongitude], function(error, results) {
                    if (error) {
                        return connection.rollback(function() {
                            response(error, null)
                        })
                    }
                    console.log(__filename + ': placeSqlQuery * response: ', results)
                    connection.release()

                    let placeNumber = results.insertId
                    for (var i in setImagesValues) {
                        setImagesValues[i].unshift(placeNumber)
                    }
                    for (var j in setKeywordNameValues) {
                        setKeywordNameValues[j].unshift(placeNumber)
                    }
                    console.log(setImagesValues)
                    console.log(setKeywordNameValues)

                    // images insert query
                    Images.insertPlaceImages([setImagesValues], function(error, results) {
                        if (error) {
                            return connection.rollback(function() {
                                response(error, null)
                            })
                        }

                        // keyword insert query
                        Keyword.insertPlaceKeyword([setKeywordNameValues], function(error, results) {
                            if (error) {
                                return connection.rollback(function() {
                                    response(error, null)
                                })
                            }
                            connection.commit(function(error) {
                                if (error) {
                                    return connection.rollback(function() {
                                        response(error, null)
                                    })
                                }
                                console.log('Transaction Success !!!')
                                response(null, results)

                            })  // commit()
                        })  // Keyword.insertPlaceKeyword()
                    })  // Images.insertPlaceImages()
                })  // placeSqlQuery()
            })  // beginTransaction()
        })  // db connection()
    } catch (error) {
        throw new ErrorHandler(500, 'database error' + error.statusCode + error.message)
    }
}

Place.readOnePlace = function(request, response) {
    try {
        db((error, connection) => {
            const selectPlaceOne = `SELECT P.placeNumber, P.name, P.address, CONCAT_WS(",", P.openingTime1, P.openingTime2, P.openingTime3) AS openingTime, ` +
                                    `P.phoneNumber, P.content, DATE_FORMAT(P.regiDate, '%Y-%m-%d') as regiDate, P.latitude, P.longitude, A.keywordNumber, A.keywordName, ` +
                                    `GROUP_CONCAT(PI.imageNumber SEPARATOR ',') AS 'imageNumber', ` +
                                    `GROUP_CONCAT(PI.originalImageName SEPARATOR ',') AS 'originalImageName', ` +
                                    `GROUP_CONCAT(PI.savedImageName SEPARATOR ',') AS 'savedImageName' ` +
                                    `FROM place P ` +
                                    `LEFT JOIN place_images PI ON PI.placeNumber = P.placeNumber ` +
                                    `LEFT JOIN (SELECT PHK.placeNumber, ` +
                                    `            GROUP_CONCAT(K.keywordNumber SEPARATOR ',') AS 'keywordNumber', ` +
                                    `            GROUP_CONCAT(K.name SEPARATOR ',') AS 'keywordName' ` +
                                    `            FROM place_has_keyword PHK ` +
                                    `            LEFT JOIN keyword K ON K.keywordNumber = PHK.keywordNumber ` +
                                    `            GROUP BY PHK.placeNumber ` +
                                    `            ORDER BY keywordNumber DESC) A ON A.placeNumber = P.placeNumber ` +
                                    `WHERE P.placeNumber = ? ` +
                                    `GROUP BY P.placeNumber`
            connection.query(selectPlaceOne, [request, request], function(error, results) {
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

Place.readAllPlace = function(response, next) {
    try {
        db((error, connection) => {
            const selectPlaceAll = `SELECT LH.likeNumber, P.placeNumber, P.name, DATE_FORMAT(P.regiDate, '%Y-%m-%d') as regiDate, A.keywordNumber, A.keywordName, ` +
                                    `GROUP_CONCAT(PI.imageNumber SEPARATOR ',') AS 'imageNumber', ` +
                                    `GROUP_CONCAT(PI.originalImageName SEPARATOR ',') AS 'originalImageName', ` +
                                    `GROUP_CONCAT(PI.savedImageName SEPARATOR ',') AS 'savedImageName' ` +
                                    `FROM place P ` +
                                    `LEFT JOIN place_images PI ON PI.placeNumber = P.placeNumber ` +
                                    `LEFT JOIN like_history LH ON LH.placeNumber = P.placeNumber ` +
                                    `LEFT JOIN (select PHK.placeNumber, GROUP_CONCAT(K.keywordNumber SEPARATOR ',') AS 'keywordNumber', GROUP_CONCAT(K.name SEPARATOR ',') AS 'keywordName' ` +
                                    `        FROM place_has_keyword PHK ` +
                                    `        JOIN keyword K ON K.keywordNumber = PHK.keywordNumber ` +
                                    `        GROUP BY PHK.placeNumber) A ON A.placeNumber = P.placeNumber ` +
                                    `GROUP BY P.placeNumber ` +
                                    `ORDER BY P.placeNumber DESC ` +
                                    `LIMIT 50`
            connection.query(selectPlaceAll, function(error, results) {
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

Place.updatePlace = function([name, address, keywordName, openingTime1, openingTime2, openingTime3, phoneNumber, content, placeNumber], response) {
    try {
        db((error, connection) => {
            const sqlQuery = `UPDATE place SET name = ?, address = ?, openingTime1 = ?, openingTime2 =?, openingTime3 = ?, phoneNumber = ?, content = ? WHERE placeNumber = ?`
            connection.query(sqlQuery, [name, address, openingTime1, openingTime2, openingTime3, phoneNumber, content, placeNumber], function(error, results) {
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

Place.deletePlace = function(request, response) {
    try {
        db((error, connection) => {
            const deletePlaceSqlQuery = `DELETE FROM place WHERE placeNumber = ?`
            connection.query(deletePlaceSqlQuery, request, function(error, results) {
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

Place.getCutrrentLocation = function([latitude, longitude, latitude2], response) {
    try {
        db((error, connection) => {
            const sql = "select " +
                        "placeNumber, name, address, " + 
                        "( 6371 * acos( cos( radians( ? ) ) * cos( radians(latitude) ) " +
                        "* cos( radians(longitude) - radians( ? ) ) + sin( radians( ? ) ) " + 
                        "* sin( radians( latitude ) ) ) ) AS distance " +
                        "from place " +
                        "HAVING distance < 1 " +
                        "ORDER BY distance desc " +
                        "LIMIT 0 , 5" 
            connection.query(sql, [latitude, longitude, latitude2], function(error, results) {
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

Place.selectAllByUser = function([memberNumber], response) {
    try {
        db((error, connection) => {
            const selectAllByUserSqlQuery = `SELECT P.placeNumber, P.memberNumber, P.name, P.address, ` +
                                                    `GROUP_CONCAT(PI.imageNumber SEPARATOR ',') AS 'imageNumber', ` +
                                                    `GROUP_CONCAT(PI.originalImageName SEPARATOR ',') AS 'originalImageName', ` +
                                                    `GROUP_CONCAT(PI.savedImageName SEPARATOR ',') AS 'savedImageName' ` +
                                            `FROM place P ` +
                                            `LEFT JOIN member M ON M.memberNumber = P.memberNumber ` +
                                            `LEFT JOIN place_images PI ON PI.placeNumber = P.placeNumber ` +
                                            `WHERE P.memberNumber = ? ` +
                                            `GROUP BY P.placeNumber ` +
                                            `ORDER BY P.placeNumber DESC`
            connection.query(selectAllByUserSqlQuery, [memberNumber], function(error, results) {
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

module.exports = Place