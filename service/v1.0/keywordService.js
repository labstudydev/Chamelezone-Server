const { ErrorHandler }      = require('../../costomModules/customError')
const Keyword               = require('../../dao/v1.0/keywordDao.js')

exports.keywordReadAll = function(request, response, next) {
    Keyword.selectAllKeyword(function(error, keyword) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }
        response.status(200).send(keyword)
    })
}

exports.keywrodReadByRank = function(request, response, next) {
    Keyword.selectAllKeywordByRank(function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }
        response.status(200).send(results)
    })
}