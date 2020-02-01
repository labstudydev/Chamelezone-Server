/* ==================== START modules ==================== */

const { ErrorHandler }      = require('../costomModules/customError')
const Map                   = require('../dao/mapDao.js')
const isEmpty               = require('../costomModules/valueCheck')

/* ==================== END modules ==================== */

exports.mapSearchPlaceByName = function(request, response, next) {
    let name = request.params.name

    isEmpty('name', name)
    console.log("여기?")

    Map.selectPlaceByName(name, function(error, results) {
        if (error) {
            console.log(__filename + ", Map.selectPlaceByName() error status code 500 !!!")
            return next(new ErrorHandler(500, error))
        }
        console.log("이번엔 너냐 : " + typeof JSON.stringify(results[0].keywordName))
        response.status(200).send(results)
    })
}