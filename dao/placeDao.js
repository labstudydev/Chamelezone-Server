/* ==================== START modules ==================== */

const db            = require('../config/db');

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

// 함수랑 API 분할

// 장소&키워드에 먼저 값을 insert한다.
Place.createPlace = function([name, address, keyword1, keyword2, keyword3, openingTime1, openingTime2, openingTime3, phoneNumber, content, latitude, longitude], response) {
    db((error, connection) => {
        // 일단 place 테이블부터 insert
        const placeSqlQuery = 'INSERT INTO place (name, address, openingTime1, openingTime2, openingTime3, phoneNumber, content, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
        connection.query(placeSqlQuery, [name, address, openingTime1, openingTime2, openingTime3, phoneNumber, content, latitude, longitude], function(error, results) {
            if (error) {
                console.log(__filename + "placeSqlQuery : error: ", error)
                connection.release()
                return response(error, null)
            }
            console.log(__filename + ': response: ', results)
            response(null, results)
            connection.release() // insert placeSqlQuery connection release

            // 삽입된 place 테이블의 insert ID
            let placeNumber = results.insertId
            const keywordSqlQuery = 'SELECT keywordNumber FROM keyword WHERE name = ? || name = ? || name = ?;'
            db((error, connection) => {
                connection.query(keywordSqlQuery, [keyword1, keyword2, keyword3], function(error, results, fields){
                    console.log(__filename + " == keywordSqlQuery ==여기에 잘들어왔어요~")
                    if (error) {
                        console.log(__filename + "keywordSqlQuery : error: ", error)
                        connection.release()
                        return response(error, null)
                    }

                    console.log(__filename + ': response: ', results)
                    connection.release() // select keywrodSqlQuery connection release

                    // else 성공하면 placeHasKeyword 테이블 insert
                    // request = placeKeywordNumber, keywordNumber
                    const keywordArr = new Array();

                    // 변수선언 var
                    for(var i = 0; i < 3; i++){
                        keywordArr[i]= results[i].keywordNumber
                    }
                    
                    // 변수선언 let
                    for(let i = 0; i < keywordArr.length; i++) {
                        db((error, connection) => {
                            const placeHasKeywordSqlQuery = 'INSERT INTO place_has_keyword (placeNumber, keywordNumber) VALUES(?, ?)'
                            connection.query(placeHasKeywordSqlQuery, [placeNumber, keywordArr[i]], function(error, results) {
                                console.log(__filename + " == placeHasKeywordSqlQuery == 여기에 잘들어왔어요~")
                                if (error) {
                                    console.log(__filename + "placeHasKeywordSqlQuery : error: ", error)
                                    connection.release() // placeHasKeywordSqlQuery connection release
                                    return response(error, null)
                                }
                                
                                console.log(__filename + ': response: ', results)
                                connection.release() // insert keyword connection query
                            })
                        })
                    }
                })
            })
        })
    })
}

Place.readOnePlace = function(request, response, next) {
    try {
        db((error, connection) => {
            connection.query("SELECT * FROM place WHERE placeNumber = ?", request, function(error, results) {
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

Place.updatePlace = function([name, address, openingTime, phoneNumber, content, placeNumber], response) {
    try {
        db((error, connection) => {
            connection.query("UPDATE place SET name = ?, address = ?, openingTime = ?, phoneNumber = ?, content = ? WHERE placeNumber = ?", [name, address, openingTime, phoneNumber, content, placeNumber], function(error, results) {
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