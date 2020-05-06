const Map = require('../../service/v1.1/mapService')
const isEmpty               = require('../../costomModules/valueCheck')
const util                  = require('../../costomModules/util')

exports.mapSearchPlaceByName = function(request, response, next) {
    let name = request.params.name
    const nullValueCheckObject = {
        name
    }
    isEmpty(nullValueCheckObject)

    Map.mapSearchPlaceByName(name, function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }

        if(results.length == 0 || results.length == undefined) {
            response.status(404).send("No Results Found")
        } else {
            util.resultStringToArray(results, ['keywordName', 'imageNumber', 'savedImageName'])
            response.status(200).send(results)
        }
    })
}