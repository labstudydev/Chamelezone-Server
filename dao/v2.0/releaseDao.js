const { ErrorHandler }      = require('../../costomModules/customError')
// const db                    = require('../../config/db')
const pool                  = require('../../config/mysql2')

// const db = makeDb(config);

var Release = function(release) { }

Release.selectApkVersion = async(response) => {
    console.log('dao IN')
    try {
        const connection = await pool.getConnection(async conn=>conn);
        console.log('dao IN 2222222222')
        try {
            console.log('dao IN 33333333333')
            
            const selectApkVersionSqlQuery = "SELECT version FROM release_apk_version";
            console.log("sadfsdafsad")
            const rows = await connection.query(selectApkVersionSqlQuery)
            console.log("teststesetsetset")
            connection.release()
            console.log(rows)
            
        } catch (error) {
            throw error
        }
        
    } catch (error) {
        throw error
    }
    // try {
    //     const selectApkVersionSqlQuery = `SELECT version FROM release_apk_version`
    //     const rows = await connection.query(selectApkVersionSqlQuery)
        
    //     console.log('dao result => ', rows[0])
    //     return rows
    //     // return JSON.parse(JSON.stringify(rows))
    // } catch (error) {
    //     throw error
    // }
}

// Release.selectApkVersion = async(response) => {
//     try {
//         const conn = db((error, connection) => {

//         })
//         // await db((error, connection) => {
//         //     const connection = await 
//         //     let selectApkVersionSqlQuery = `SELECT version FROM release_apk_version`
//         //     connection.query(selectApkVersionSqlQuery, function(error, results) {
//         //         connection.release()
//         //         if (error) { return response(error, null) }
//         //         else { response(null, results) }
//         //     })
//         // })
//     } catch (error) {
//         throw new ErrorHandler(500, error)
//     }
// }

module.exports = Release