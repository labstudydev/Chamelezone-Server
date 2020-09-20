const { ErrorHandler }      = require('../../costomModules/customError')
const db                    = require('../../config/db')

var Release = function(release) { }

Release.selectApkVersion = function(response) {
    try {
        db((error, connection) => {
            let selectApkVersionSqlQuery = `SELECT version FROM release_apk_version`
            connection.query(selectApkVersionSqlQuery, function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

module.exports = Release