const Release = require('../../service/v1.0/releaseService.js')

exports.getApkVersion = function(request, response, next) {
    Release.getApkVersion(request, response, next)
}