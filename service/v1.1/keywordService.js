const { ErrorHandler }      = require('../../costomModules/customError')
const Keyword               = require('../../dao/v1.1/keywordDao.js')

exports.keywordReadAll = function(request, response, next) {
    try {
        Keyword.selectAllKeyword(function(error, results) {
            if (error) { return response(error, null) }
            response(null, results)
        })    
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}