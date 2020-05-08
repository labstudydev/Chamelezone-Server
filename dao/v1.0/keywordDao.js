const { ErrorHandler }      = require('../../costomModules/customError')
const db                    = require('../../config/db')

var Keyword = function(keyword) { }

Keyword.selectAllKeyword = function(response) {
    try {
        db((error, connection) => {
            const keywordSqlQuery = 'SELECT keywordNumber, name FROM keyword ORDER BY name ASC'
            connection.query(keywordSqlQuery, function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

Keyword.insertPlaceKeyword = function([setKeywordNameValues], response) {
    try {
        db((error, connection) => {
            const placeHasKeywordSqlQuery = `INSERT INTO place_has_keyword ('placeNumber', 'keywordNumber') VALUES ?`
            connection.query(placeHasKeywordSqlQuery, [setKeywordNameValues], function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

Keyword.updatePlaceKeyword = function([setKeywordNameValues], response) {
    try {
        db((error, connection) => {
            const updatePlaceHasKeywordSqlQuery = `INSERT INTO place_has_keyword ('placeNumber', 'keywordNumber') VALUES ?`
            connection.query(updatePlaceHasKeywordSqlQuery, [setKeywordNameValues], function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

Keyword.selectAllKeywordByRank = function(response) {
    try {
        db((error, connection) => {
            const selectKeywordByRankSqlQuery = `SELECT PHK.keywordNumber, COUNT(*) as keywordRank, K.name
                                                FROM place_has_keyword PHK
                                                LEFT JOIN keyword K ON K.keywordNumber = PHK.keywordNumber
                                                GROUP BY keywordNumber
                                                ORDER BY keywordRank DESC, keywordNumber ASC
                                                LIMIT 10`
            connection.query(selectKeywordByRankSqlQuery, function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            }) 
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

module.exports = Keyword