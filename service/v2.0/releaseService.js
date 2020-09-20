const { ErrorHandler }      = require('../../costomModules/customError')
const Release               = require('../../dao/v2.0/releaseDao.js')

exports.getApkVersion = async(request, response) => {
    console.log('service IN')
    try {
        const result = await Release.selectApkVersion()
        console.log('service => result', result)
        return result
    } catch (error) {
        throw error
    }
}