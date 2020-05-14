const { ErrorHandler }      = require('../../costomModules/customError')
const Release = require('../../service/v1.1/releaseService.js')

exports.getApkVersion = function(request, response, next) {
    Release.getApkVersion(request, function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }

        response.status(200).send(results)
    })
}