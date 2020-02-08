/* ==================== START modules ==================== */

const Keyword = require('../dao/keywordDao.js');
const { ErrorHandler, handleError } = require('../costomModules/customError')
const isEmpty = require('../costomModules/valueCheck')

/* ==================== END modules ==================== */

exports.keyword_readAll = function(request, response, next) {
    Keyword.selectAllKeyword(function(error, keyword) {
        if (error) {
            console.log(__filename + ", Keyword.selectAllKeyword() error status code 500 !!!")
            return next(new ErrorHandler(500, error))
        }
        response.status(200).send(keyword)
    })
}

// exports.insert_Keyword = function(request, response, next) {
//     console.log(__filename + "나는 request: " + request)

//     Keyword.insertKeyword(request, function(error, keyword) {
//         console.log(__filename + " == insertKeyword success !!!!!")
//         if (error) {
//             console.log(__filename + ", Keyword.insertKeyword() error status code 500 !!!")
//             return next(new ErrorHandler(500, error))
//         }
//         response.status(200).send(keyword)
//     })
// }