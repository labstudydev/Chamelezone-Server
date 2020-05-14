const { ErrorHandler }      = require('../../costomModules/customError')
const Release               = require('../../dao/v1.0/releaseDao.js')

exports.getApkVersion = function(request, response, next) {
    Release.selectApkVersion(function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }

        response.status(200).send(results[0])
    })
}