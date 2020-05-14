const { ErrorHandler }      = require('../../costomModules/customError')
const Release               = require('../../dao/v1.1/releaseDao.js')

exports.getApkVersion = function(request, response, next) {
    try {
        Release.selectApkVersion(function(error, results) {
            if (error) { return response(error, null) }
            response(null, results[0])
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}