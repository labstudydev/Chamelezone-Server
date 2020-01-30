/* ==================== START modules ==================== */

const { ErrorHandler }      = require('../costomModules/customError')
const Map                   = require('../dao/mapDao.js')
const isEmpty               = require('../costomModules/valueCheck')

/* ==================== END modules ==================== */

exports.mapSearchPlaceByName = function(request, response, next) {
    let name = request.params.name

    isEmpty('name', name)

    Map.selectPlaceByName(name, function(error, results) {
        if (error) {
            console.log(__filename + ", Map.selectPlaceByName() error status code 500 !!!")
            return next(new ErrorHandler(500, error))
        }
        response.status(200).send(results)
    })
}