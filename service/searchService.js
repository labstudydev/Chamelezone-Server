/* ==================== START modules ==================== */

const Search = require('../dao/searchDao.js');
const { ErrorHandler, handleError } = require('../costomModules/customError')
const isEmpty = require('../costomModules/valueCheck')

/* ==================== END modules ==================== */

exports.searchByName = function(request, response, next) {
    let name = request.params.name

    isEmpty('name', name)

    Search.searchByName(name, function(error, search) {
        if (error) {
            console.log(__filename + ", Search.searchByName() error status code 500 !!!")
            return next(new ErrorHandler(500, error))
        }
        response.status(200).send(search)
    })
}