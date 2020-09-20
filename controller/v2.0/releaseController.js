const { ErrorHandler }      = require('../../costomModules/customError')
const Release               = require('../../service/v2.0/releaseService.js')

exports.getApkVersion = async(request, response, next) => {
    console.log("contoller IN")
    try {
        const result = await Release.getApkVersion(request)
        console.log('controller => result', result)
        return response.status(200).send(result[0])
    } catch (error) {
        next(new ErrorHandler(500, error.message))
    }
}