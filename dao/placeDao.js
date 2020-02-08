/* ==================== START modules ==================== */

const { ErrorHandler }      = require('../costomModules/customError')
const db                    = require('../config/db')
const Keyword               = require('../dao/keywordDao')
const Images                = require('../dao/imagesDao')

/* ==================== END modules ==================== */

var Place = function(place) {
    this.placeNumber = place.placeNumber;
    this.name = place.name;
    this.address = place.address;
    this.openingTime1 = place.openingTime1;
    this.openingTime2 = place.openingTime2;
    this.openingTime3 = place.openingTime3;
    this.phoneNumber = place.phoneNumber;
    this.content = place.content;
    this.fileName = place.fileName;
    this.fileExtension = place.fileExtension;
    this.regiDate = place.regiDate;
    this.latitude = place.latitude;
    this.longitude = place.longitude;
};

// 장소&키워드에 먼저 값을 insert한다.
Place.createPlace = function([name, address, setKeywordNameValues, openingTime1, openingTime2, openingTime3, phoneNumber, content, parseLatitude, parseLongitude, setImagesValues], response) {
    try {
        db((error, connection) => {
            connection.beginTransaction(function(error) {
                if (error) {
                    response(error, null)
                }
                const placeSqlQuery = 'INSERT INTO place (name, address, openingTime1, openingTime2, openingTime3, phoneNumber, content, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
                connection.query(placeSqlQuery, [name, address, openingTime1, openingTime2, openingTime3, phoneNumber, content, parseLatitude, parseLongitude], function(error, results) {
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
                                console.log('Transaction Success !!!');
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
            let selectPlaceOne = `select P.placeNumber, P.name, P.address, P.openingTime1, P.openingTime2, P.openingTime3, P.phoneNumber, P.content, P.regiDate, P.latitude, P.longitude, A.keywordNumber, A.keywordName, ` +
                                    `group_concat(PI.imageNumber separator ',') AS 'imageNumber', ` +
                                    `group_concat(PI.originalImageName separator ',') AS 'originalImageName', ` +
                                    `group_concat(PI.savedImageName separator ',') AS 'savedImageName' ` +
                                    `from place P ` +
                                    `left join place_images PI on PI.placeNumber = P.placeNumber ` +
                                    `left join (select PHK.placeNumber, group_concat(K.keywordNumber separator ',') AS 'keywordNumber', group_concat(K.name separator ',') AS 'keywordName' ` +
                                    `        from place_has_keyword PHK ` +
                                    `        join keyword K on K.keywordNumber = PHK.keywordNumber ` +
                                    `        where PHK.placeNumber = ?) A on A.placeNumber = P.placeNumber ` +
                                    `where P.placeNumber = ? ` +
                                    `group by P.placeNumber`
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
            connection.query("SELECT * FROM place", function(error, results) {
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
            var sqlQuery = "UPDATE place SET name = ?, address = ?, openingTime1 = ?, openingTime2 =?, openingTime3 = ?, phoneNumber = ?, content = ? WHERE placeNumber = ?"
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
            connection.query("DELETE FROM place WHERE placeNumber = ?", request, function(error, results) {
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
    let sql = "select " +
                "placeNumber, name, address, " + 
                "( 6371 * acos( cos( radians( ? ) ) * cos( radians(latitude) ) " +
                "* cos( radians(longitude) - radians( ? ) ) + sin( radians( ? ) ) " + 
                "* sin( radians( latitude ) ) ) ) AS distance " +
                "from place " +
                "HAVING distance < 1 " +
                "ORDER BY distance desc " +
                "LIMIT 0 , 5";
                
    db((error, connection) => {
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
}

module.exports= Place;