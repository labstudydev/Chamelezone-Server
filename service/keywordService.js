/* ==================== START modules ==================== */

const Keyword = require('../dao/keywordDao.js');
const { ErrorHandler, handleError } = require('../costomModules/customError')
const isEmpty = require('../costomModules/valueCheck')

/* ==================== END modules ==================== */

exports.keyword_readAll = function(request, response, next) {
    
    Keyword.readAllKeyword(function(error, keyword) {
        if (error) {
            console.log(__filename + ", Keyword.readAllKeyword() error status code 500 !!!")
            return next(new ErrorHandler(500, error))
        }

        response.status(200).send(keyword)
    })
}