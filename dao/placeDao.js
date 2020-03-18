const { ErrorHandler }      = require('../costomModules/customError')
const db                    = require('../config/db')
const Keyword               = require('../dao/keywordDao')
const Images                = require('./imageDao')

var Place = function(place) { }

Place.createPlace = function([memberNumber, name, address, setKeywordNameValues, openingTimeString, phoneNumber, content, parseLatitude, parseLongitude, setImagesValues], response) {
    try {
        db((error, connection) => {
            connection.beginTransaction(function(error) {
                if (error) {
                    response(error, null)
                }
                const placeSqlQuery = `INSERT INTO place (memberNumber, name, address, openingTime, phoneNumber, content, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
                connection.query(placeSqlQuery, [memberNumber, name, address, openingTimeString, phoneNumber, content, parseLatitude, parseLongitude], function(error, results) {
                    if (error) {
                        return connection.rollback(function() {
                            response(error, null)
                        })
                    }
                    connection.release()

                    let placeNumber = results.insertId
                    for (var i in setImagesValues) {
                        setImagesValues[i].unshift(placeNumber)
                    }
                    for (var j in setKeywordNameValues) {
                        setKeywordNameValues[j].unshift(placeNumber)
                    }

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
                                response(null, results)
                            })  // commit()
                        })  // Keyword.insertPlaceKeyword()
                    })  // Images.insertPlaceImages()
                })  // placeSqlQuery()
            })  // beginTransaction()
        })  // db connection()
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

Place.readOnePlace = function(request, response) {
    try {
        db((error, connection) => {
            const selectPlaceOne = `SELECT P.placeNumber, P.name, P.address, P.phoneNumber, P.content, P.latitude, P.longitude, A.keywordName, ` +
                                    `DATE_FORMAT(P.regiDate, '%Y-%m-%d') as regiDate, ` +
                                    `P.openingTime, ` +
                                    `GROUP_CONCAT(PI.imageNumber SEPARATOR ',') AS 'imageNumber', ` +
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
            connection.query(selectPlaceOne, request, function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

Place.readAllPlace = function(memberNumber, response, next) {
    try {
        db((error, connection) => {
            const selectPlaceAll = `SELECT PHK.placeNumber, P.memberNumber, LH.likeNumber, P.name, P.latitude, P.longitude,` +
                                        `GROUP_CONCAT(DISTINCT K.name SEPARATOR ',') AS 'keywordName', ` +
                                        `GROUP_CONCAT(DISTINCT PI.imageNumber SEPARATOR ',') AS 'imageNumber', ` +
                                        `GROUP_CONCAT(DISTINCT PI.savedImageName SEPARATOR ',') AS 'savedImageName' ` +
                                    `FROM place_has_keyword PHK ` +
                                    `LEFT JOIN place P ON P.placeNumber = PHK.placeNumber ` +
                                    `LEFT JOIN place_images PI ON PI.placeNumber = PHK.placeNumber ` +
                                    `LEFT JOIN keyword K ON K.keywordNumber = PHK.keywordNumber ` +
                                    `LEFT JOIN (SELECT likeNumber, memberNumber, placeNumber ` +
                                    `           FROM like_history ` +
                                    `           WHERE memberNumber = ?) LH ON LH.placeNumber = PHK.placeNumber ` +
                                    `GROUP BY P.placeNumber ` +
                                    `ORDER BY P.placeNumber DESC ` +
                                    `LIMIT 30`
            connection.query(selectPlaceAll, memberNumber, function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

Place.updatePlace = function([setImagesValues, setKeywordNameValues, name, address, openingTime1, openingTime2, openingTime3, phoneNumber, content, placeNumber], response) {
    try {
        db((error, connection) => {
            connection.beginTransaction(function(error) {
                if (error) {
                    response(error, null)
                }
                
                const sqlQuery = `UPDATE place SET name = ?, address = ?, openingTime1 = ?, openingTime2 =?, openingTime3 = ?, phoneNumber = ?, content = ? WHERE placeNumber = ?`
                connection.query(sqlQuery, [name, address, openingTime1, openingTime2, openingTime3, phoneNumber, content, placeNumber], function(error, results) {
                    if (error) {
                        return connection.rollback(function() {
                            response(error, null)
                        })
                    }
                    connection.release()

                    let placeNumber = results.insertId
                    for (var i in setImagesValues) {
                        setImagesValues[i].unshift(placeNumber)
                    }
                    for (var j in setKeywordNameValues) {
                        setKeywordNameValues[j].unshift(placeNumber)
                    }

                    Images.updatePlaceImages([setImagesValues], function(error, results) {
                        if (error) {
                            return connection.rollback(function() {
                                response(error, null)
                            })
                        }

                        Keyword.updatePlaceKeyword([setKeywordNameValues], function(error, results) {
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
                                response(null, results)
                            })  // commit()
                        })  // Keyword.updatePlaceKeyword()
                    })  // Images.updatePlaceImages()
                })  // placeSqlQuery()
            })  // beginTransaction()
        })  // db connection()
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

Place.deletePlace = function(request, response) {
    try {
        db((error, connection) => {
            const deletePlaceSqlQuery = `DELETE FROM place WHERE placeNumber = ?`
            connection.query(deletePlaceSqlQuery, request, function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

Place.getCutrrentLocation = function([latitude, longitude, latitude2], response) {
    try {
        db((error, connection) => {
            const getCutrrentLocationSqlQuery = `SELECT ` +
                                                `placeNumber, name, address, ` + 
                                                `( 6371 * acos( cos( radians( ? ) ) * cos( radians(latitude) ) ` +
                                                `* cos( radians(longitude) - radians( ? ) ) + sin( radians( ? ) ) ` + 
                                                `* sin( radians( latitude ) ) ) ) AS distance ` +
                                                `FROM place ` +
                                                `HAVING distance < 1 ` +
                                                `ORDER BY distance desc ` +
                                                `LIMIT 0 , 5`
            connection.query(getCutrrentLocationSqlQuery, [latitude, longitude, latitude2], function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

Place.selectAllByUser = function([memberNumber], response) {
    try {
        db((error, connection) => {
            const selectAllByUserSqlQuery = `SELECT P.placeNumber, P.memberNumber, P.name, P.address, KEYWORD.keywordName, ` +
                                                    `GROUP_CONCAT(PI.imageNumber SEPARATOR ',') AS 'imageNumber', ` +
                                                    `GROUP_CONCAT(PI.savedImageName SEPARATOR ',') AS 'savedImageName' ` +
                                            `FROM place P ` +
                                            `LEFT JOIN member M ON M.memberNumber = P.memberNumber ` +
                                            `LEFT JOIN place_images PI ON PI.placeNumber = P.placeNumber ` +
                                            `LEFT JOIN (select PHK.placeNumber, GROUP_CONCAT(K.keywordNumber SEPARATOR ',') AS 'keywordNumber', GROUP_CONCAT(K.name SEPARATOR ',') AS 'keywordName' ` +
                                            `           FROM place_has_keyword PHK ` +
                                            `           JOIN keyword K ON K.keywordNumber = PHK.keywordNumber ` +
                                            `           GROUP BY PHK.placeNumber) KEYWORD ON KEYWORD.placeNumber = P.placeNumber ` +
                                            `WHERE P.memberNumber = ? ` +
                                            `GROUP BY P.placeNumber ` +
                                            `ORDER BY P.placeNumber DESC`
            connection.query(selectAllByUserSqlQuery, [memberNumber], function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

Place.selectPlaceDuplicateCheck = function([name, latitude, longitude], response) {
    try {
        db((error, connection) => {
            const selectPlaceDuplicateCheckSqkQyery = `SELECT placeNumber, name, address, latitude, longitude FROM place WHERE name = ? AND latitude = ? AND longitude = ?;`
            connection.query(selectPlaceDuplicateCheckSqkQyery, [name, latitude, longitude], function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

Place.selectPlaceEditCheck = function([memberNumber, name], response) {
    try {
        db((error, connection) => {
            const selectPlaceEditCheckSqlQuery = `SELECT memberNumber, name FROM place WHERE memberNumber = ? AND name = ?`
            connection.query(selectPlaceEditCheckSqlQuery, [memberNumber, name], function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

module.exports = Place