/* ==================== START modules ==================== */

const PlaceHasKeyword = require('../../dao/placeDao.js')
const { ErrorHandler, handleError } = require('../../costomModules/customError')
const isEmpty = require('../../costomModules/valueCheck')

/* ==================== END modules ==================== */

exports.insertKeyword = function (request, response, next0) {
    console.log("여기는 placeHasKeyword Service")

    PlaceHasKeyword.insertKeyword(request, function(error, data) {
        if (error) {
            console.log(__filename + ", PlaceHasKeyword.insertKeyword() error status code 500 !!!")
            return next(new ErrorHandler(500, error))
        }
        return data
    })
}