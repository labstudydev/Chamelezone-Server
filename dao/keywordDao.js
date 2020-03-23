const { ErrorHandler }      = require('../costomModules/customError')
const db                    = require('../config/db')

var Keyword = function(keyword) { }

Keyword.selectAllKeyword = function(response) {
    try {
        db((error, connection) => {
            const keywordSqlQuery = 'SELECT keywordNumber, name FROM keyword'
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
            const placeHasKeywordSqlQuery = 'INSERT INTO place_has_keyword (`placeNumber`, `keywordNumber`) VALUES ?'
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

'UPDATE place_images SET originalImageName = ?, savedImageName = ?, mimetype = ?, imageSize = ? WHERE placeNumber = ?'

Keyword.updatePlaceKeyword = function([setKeywordNameValues], response) {
    try {
        db((error, connection) => {
            const updatePlaceHasKeywordSqlQuery = 'INSERT INTO place_has_keyword (`placeNumber`, `keywordNumber`) VALUES ?'
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

module.exports = Keyword