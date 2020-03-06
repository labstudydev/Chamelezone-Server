const ErrorHandler          = require('../costomModules/customError')
const Keyword               = require('../dao/keywordDao.js')

exports.keyword_readAll = function(request, response, next) {
    Keyword.selectAllKeyword(function(error, keyword) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }
        response.status(200).send(keyword)
    })
}