const { ErrorHandler }      = require('../../costomModules/customError')
const Map                   = require('../../dao/v1.1/mapDao.js')

exports.mapSearchPlaceByName = function(name, response, next) {
    try {
        Map.selectPlaceByName(name, function(error, results) {
            if (error) { return response(error, null) }
            response(null, results)
        })    
    } catch (error) {
        throw new ErrorHandler(500, errro)
    }
}