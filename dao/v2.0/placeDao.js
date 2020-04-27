const { ErrorHandler }      = require('../../costomModules/customError')
const db                    = require('../../config/db')
const Keyword               = require('../dao/keywordDao')
const Images                = require('./imageDao')

var Place = function(place) { }

Place.createPlace = function([memberNumber, name, address, addressDetail, setKeywordNameValues, openingTimeString, phoneNumber, content, parseLatitude, parseLongitude, setImagesValues], response) {
    try {
        db((error, connection) => {
            connection.beginTransaction(function(error) {
                if (error) {
                    response(error, null)
                }
                
                const placeSqlQuery = `INSERT INTO place (memberNumber, name, address, addressDetail, openingTime, phoneNumber, content, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
                connection.query(placeSqlQuery, [memberNumber, name, address, addressDetail, openingTimeString, phoneNumber, content, parseLatitude, parseLongitude], function(error, results) {
                    if (error) {
                        connection.release()
                        return connection.rollback(function() {
                            response(error, null)
                        })
                    }

                    let placeNumber = results.insertId
                    for (var i in setImagesValues) {
                        setImagesValues[i].unshift(placeNumber)
                    }
                    for (var j in setKeywordNameValues) {
                        setKeywordNameValues[j].unshift(placeNumber)
                    }
                    
                    const placeImageSqlQuery = `INSERT INTO place_images (placeNumber, originalImageName, savedImageName, mimetype, imageSize) VALUES ?`
                    connection.query(placeImageSqlQuery, [setImagesValues], function(error, results) {
                        if (error) {
                            connection.release()
                            return connection.rollback(function() {
                                response(error, null)
                            })
                        }
                        
                        const placeHasKeywordSqlQuery = `INSERT INTO place_has_keyword (placeNumber, keywordNumber) VALUES ?`
                        connection.query(placeHasKeywordSqlQuery, [setKeywordNameValues], function(error, results) {
                            if (error) {
                                connection.release()
                                return connection.rollback(function() {
                                    response(error, null)
                                })
                            }

                            connection.commit(function(error) {
                                if (error) {
                                    return connection.rollback(function() {
                                        connection.release()
                                        response(error, null)
                                    })
                                }
                                connection.release()
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
            const selectPlaceOne = `SELECT P.placeNumber, P.memberNumber, P.name, P.address, P.addressDetail, P.phoneNumber, P.content, P.latitude, P.longitude, ` +
                                    `GROUP_CONCAT(DISTINCT A.placeKeywordNumber SEPARATOR ',') AS 'placeKeywordNumber', ` +
                                    `A.keywordName, DATE_FORMAT(P.regiDate, '%Y-%m-%d') as regiDate, ` +
                                    `P.openingTime, ` +
                                    `GROUP_CONCAT(PI.imageNumber SEPARATOR ',') AS 'imageNumber', ` +
                                    `GROUP_CONCAT(PI.savedImageName SEPARATOR ',') AS 'savedImageName' ` +
                                    `FROM place P ` +
                                    `LEFT JOIN place_images PI ON PI.placeNumber = P.placeNumber ` +
                                    `LEFT JOIN (SELECT PHK.placeNumber, ` +
                                    `            GROUP_CONCAT(PHK.placeKeywordNumber SEPARATOR ',') AS 'placeKeywordNumber', ` +
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

Place.readAllPlace = function(memberNumber, response) {
    try {
        db((error, connection) => {
            const selectPlaceAll = `SELECT PHK.placeNumber, P.memberNumber, LH.likeNumber, P.name, P.latitude, P.longitude,` +
                                        `GROUP_CONCAT(DISTINCT K.name ORDER BY placeKeywordNumber SEPARATOR ',') AS 'keywordName', ` +
                                        `GROUP_CONCAT(DISTINCT PI.imageNumber ORDER BY PI.imageNumber SEPARATOR ',') AS 'imageNumber', ` +
                                        `GROUP_CONCAT(DISTINCT PI.savedImageName ORDER BY PI.imageNumber SEPARATOR ',') AS 'savedImageName' ` +
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
            const selectAllByUserSqlQuery = `SELECT P.placeNumber, P.memberNumber, P.name, P.address, P.addressDetail, KEYWORD.keywordName, ` +
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
            const selectPlaceDuplicateCheckSqkQyery = `SELECT placeNumber, name, address, addressDetail, latitude, longitude FROM place WHERE name = ? AND latitude = ? AND longitude = ?`
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

Place.updatePlace = function([address, addressDetail, phoneNumber, content, parseLatitude, parseLongitude, placeNumber, memberNumber], response) {
    try {
        db((error, connection) => {
            const updatePlaceSqlQuery = `UPDATE place SET address = ?, addressDetail = ?, phoneNumber = ?, content = ?, latitude = ?, longitude = ? WHERE placeNumber = ? AND memberNumber = ?`
            connection.query(updatePlaceSqlQuery, [address, addressDetail, phoneNumber, content, parseLatitude, parseLongitude, placeNumber, memberNumber], function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

Place.selectPlaceImages = function([placeNumber], response) {
    try {
        db((error, connection) => {
            const selectPlaceImagesSqlQuery = `SELECT imageNumber, placeNumber, originalImageName, savedImageName, mimetype, imageSize FROM place_images WHERE placeNumber = ?`
            connection.query(selectPlaceImagesSqlQuery, [placeNumber], function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

Place.insertPlaceImages = function([setImagesValues], response) {
    try {
        db((error, connection) => {
            const insertPlaceImagesSqlQuery = `INSERT INTO place_images (placeNumber, originalImageName, savedImageName, mimetype, imageSize) VALUES ?`
            connection.query(insertPlaceImagesSqlQuery, [setImagesValues], function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

Place.deletePlaceImages = function([placeNumber, imageNumber], response) {
    try {
        db((error, connection) => {
            const deletePlaceImagesSqlQuery = `DELETE FROM place_images WHERE placeNumber in (?) AND imageNumber in (?)`
            connection.query(deletePlaceImagesSqlQuery, [placeNumber, imageNumber], function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

Place.selectPlaceHasKeyword = function([placeNumber], response) {
    try {
        db((error, connection) => {
            const selectPlaceHasKeywordSqlQuery = `SELECT placeKeywordNumber, placeNumber, keywordNumber FROM place_has_keyword WHERE placeNumber = ?`
            connection.query(selectPlaceHasKeywordSqlQuery, [placeNumber], function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

Place.updatePlaceHasKeyword = function([keywordNumber, placeKeywordNumber, placeNumber], response) {
    try {
        db((error, connection) => {
            const updatePlaceHasKeywordSqlQuery = `UPDATE place_has_keyword SET keywordNumber = ? WHERE placeKeywordNumber = ? AND placeNumber = ?`
            connection.query(updatePlaceHasKeywordSqlQuery, [keywordNumber, placeKeywordNumber, placeNumber], function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

Place.insertPlaceHasKeyowrd = function([setKeywordNameValues], response) {
    try {
        db((error, connection) => {
            const insertPlaceHasKeywordSqlQuery = `INSERT INTO place_has_keyword (placeNumber, keywordNumber) VALUES ?`
            connection.query(insertPlaceHasKeywordSqlQuery, [setKeywordNameValues], function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

Place.deletePlaceHasKeyowrd = function([placeNumber, placeKeywordNumber], response) {
    try {
        db((error, connection) => {
            const deletePlaceHasKeyowrdSqlQuery = `DELETE FROM place_has_keyword WHERE placeNumber in (?) AND placeKeywordNumber in (?)`
            connection.query(deletePlaceHasKeyowrdSqlQuery, [placeNumber, placeKeywordNumber], function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

Place.selectPlaceOpeningTime = function([placeNumber], response) {
    try {
        db((error, connection) => {
            const selectPlaceOpeningTimeSqlQuery = `SELECT placeNumber, memberNumber, name, openingTime FROM place WHERE placeNumber = ?`
            connection.query(selectPlaceOpeningTimeSqlQuery, [placeNumber], function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

Place.updatePlaceOpeningTime = function([openingTime, placeNumber], response) {
    try {
        db((error, connection) => {
            const updatePlaceOpeningTimeSqlQuery = `UPDATE place SET openingTime = ? WHERE placeNumber = ?`
            connection.query(updatePlaceOpeningTimeSqlQuery, [openingTime, placeNumber], function(error, results) {
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