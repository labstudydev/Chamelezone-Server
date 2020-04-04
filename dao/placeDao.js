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
                    console.log("connection place -- success !!!")
                    if (error) {
                        connection.release()
                        return connection.rollback(function() {
                            console.log("connection place == fail !!!")
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
                    
                    // images insert query
                    const placeImageSqlQuery = `INSERT INTO place_images (placeNumber, originalImageName, savedImageName, mimetype, imageSize) VALUES ?`
                    connection.query(placeImageSqlQuery, [setImagesValues], function(error, results) {
                    // Images.insertPlaceImages([setImagesValues], function(error, results) {
                        console.log("connection image -- success !!!")
                        if (error) {
                            connection.release()
                            return connection.rollback(function() {
                                console.log("connection image == fail !!!")
                                response(error, null)
                            })
                        }
                        
                        // keyword insert query
                        const placeHasKeywordSqlQuery = `INSERT INTO place_has_keyword (placeNumber, keywordNumber) VALUES ?`
                        connection.query(placeHasKeywordSqlQuery, [setKeywordNameValues], function(error, results) {
                        // Keyword.insertPlaceKeyword([setKeywordNameValues], function(error, results) {
                            console.log("connection keyword -- success !!!")
                            if (error) {
                                connection.release()
                                return connection.rollback(function() {
                                    console.log("connection keyword == fail !!!")
                                    response(error, null)
                                })
                            }

                            connection.commit(function(error) {
                                if (error) {
                                    return connection.rollback(function() {
                                        console.log("transaction commit == fail !!!")
                                        response(error, null)
                                    })
                                }
                                console.log("transaction commit -- success !!!")
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
            const selectPlaceOne = `SELECT P.placeNumber, P.memberNumber, P.name, P.address, P.phoneNumber, P.content, P.latitude, P.longitude, A.keywordName, ` +
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

Place.updatePlace = function([address, phoneNumber, content, parseLatitude, parseLongitude, placeNumber, memberNumber], response) {
    try {
        db((error, connection) => {
            const updatePlaceSqlQuery = `UPDATE place SET address = ?, phoneNumber = ?, content = ?, latitude = ?, longitude = ? WHERE placeNumber = ? AND memberNumber = ?`
            connection.query(updatePlaceSqlQuery, [address, phoneNumber, content, parseLatitude, parseLongitude, placeNumber, memberNumber], function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

Place.updatePlaceImages = function([originalImageName, savedImageName, mimetype, imageSize, placeNumber, imageNumber], response) {
    try {
        db((error, connection) => {
            const updatePlaceImagesSqlQuery = `UPDATE place_images SET originalImageName = ?, savedImageName = ?, mimetype = ?, imageSize = ? WHERE placeNumber = ? AND imageNumber = ?`
            connection.query(updatePlaceImagesSqlQuery, [originalImageName, savedImageName, mimetype, imageSize, placeNumber, imageNumber], function(error, results) {
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
            const selectPlaceImagesSqlQuery = `SELECT * FROM place_images WHERE placeNumber = ?`
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
// Place.selectPlaceEditCheck = function([placeNumber, memberNumber], response) {
//     try {
//         db((error, connection) => {
//             const selectPlaceEditCheckSqlQuery = `SELECT placeNumber, memberNumber, name FROM place WHERE placeNumber = ? AND memberNumber = ?`
//             connection.query(selectPlaceEditCheckSqlQuery, [placeNumber, memberNumber], function(error, results) {
//                 connection.release()
//                 if (error) { return response(error, null) }
//                 else { response(null, results) }
//             })
//         })
//     } catch (error) {
//         throw new ErrorHandler(500, error)
//     }
// }

// Place.updatePlace = function([name, address, openingTimeString, phoneNumber, content, placeNumber], response) {
//     try {
//         db((error, connection) => {
//             const updatePlaceSqlQuery = `UPDATE place SET name = ?, address = ?, openingTime = ?, phoneNumber = ?, content = ? WHERE placeNumber = ?`
//             connection.query(updatePlaceSqlQuery, [name, address, openingTimeString, phoneNumber, content, placeNumber], function(error, results) {
//                 connection.release()
//                 if (error) { return response(error, null) }
//                 else { response(null, results) }
//             })
//         })
//     } catch (error) {
//         throw new ErrorHandler(500, error)
//     }
// }

// Place.updatePlaceCheck = function(placeNumber, response) {
//     try {
//         db((error, connection) => {
//             const selectPlaceCheckSqlQuery = `SELECT name, address, phoneNumber, content, openingTime FROM place WHERE placeNumber = ?`
//             connection.query(selectPlaceCheckSqlQuery, placeNumber, function(error, results) {
//                 connection.release()
//                 if (error) { return response(error, null) }
//                 else { response(null, results) }
//             })
//         })
//     } catch (error) {
//         throw new ErrorHandler(500, error)
//     }
// }

// Place.updatePlaceHasKeywordCheck = function([placeKeywordNumber, keywordNumber, placeNumber], response) {
//     try {
//         db((error, connection) => {
//             const selectPlaceHasKeywordCheckSqlQuery = `SELECT placeKeywordNumber, keywordNumber, placeNumber FROM place_has_keyword WHERE placeKeywordNumber IN (?) AND keywordNumber IN (?) AND placeNumber = ?`
//             connection.query(selectPlaceHasKeywordCheckSqlQuery, [placeKeywordNumber, keywordNumber, placeNumber], function(error, results) {
//                 connection.release()
//                 if (error) { return response(error, null) }
//                 else { response(null, results) }
//             })
//         })
//     } catch (error) {
//         throw new ErrorHandler(500, error)
//     }
// }

// Place.insertPlaceHasKeyword = function([placeNumber, keywordNumber], response) {
//     try {
//         db((error, connection) => {
//             const selectPlaceHasKeywordCheckSqlQuery = `insert into place_has_keyword (placeNumber, keywordNumber) values (?, ?)`
//             connection.query(selectPlaceHasKeywordCheckSqlQuery, [placeNumber, keywordNumber], function(error, results) {
//                 connection.release()
//                 if (error) { return response(error, null) }
//                 else { response(null, results) }
//             })
//         })
//     } catch (error) {
//         throw new ErrorHandler(500, error)
//     }
// }
// Place.deletePlaceHasKeyword = function([placeNumber, keywordNumber], response) {
//     try {
//         db((error, connection) => {
//             const selectPlaceHasKeywordCheckSqlQuery = `delete from place_has_keyword where placeNumber = ? AND keywordNumber = ?`
//             connection.query(selectPlaceHasKeywordCheckSqlQuery, [placeNumber, keywordNumber], function(error, results) {
//                 connection.release()
//                 if (error) { return response(error, null) }
//                 else { response(null, results) }
//             })
//         })
//     } catch (error) {
//         throw new ErrorHandler(500, error)
//     }
// }
// Place.updatePlaceHasKeyword = function([keywordNumber, placeKeywordNumber], response) {
//     try {
//         db((error, connection) => {
//             const updatePlaceHasKeywordSqlQuery = `UPDATE place_has_keyword SET keywordNumber = ? WHERE placeKeywordNumber = ?`
//             connection.query(updatePlaceHasKeywordSqlQuery, [keywordNumber, placeKeywordNumber], function(error, results) {
//                 connection.release()
//                 if (error) { return response(error, null) }
//                 else { response(null, results) }
//             })
//         })
//     } catch (error) {
//         throw new ErrorHandler(500, error)
//     }
// }

module.exports = Place
