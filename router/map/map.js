/* ==================== START modules ==================== */
const mysql         = require('mysql');
const dbConfig      = require('../../config/dbConfig');
const express       = require('express');
const app           = express();
const router        = express.Router();
const bodyParser    = require('body-parser');
const crypto        = require('crypto');
/* ==================== END modules ==================== */

/* ==================== START DB Connection ==================== */
var dbOptions = {
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database
};

var connection = mysql.createConnection(dbOptions);
connection.connect();
/* ==================== END DB Connection ==================== */

// 특정 회원조회
router.get("/:memberNumber", (request, response) => {
    let memberNumber = request.params.memberNumber;
    let sqlQuery = 'SELECT * FROM member WHERE memberNumber=?';
    
    connection.query(sqlQuery, memberNumber, function (error, results, fields) {
        if (error) {
            response.status(500).end("Server Error");
            console.log(error);
        } 
        console.log(results);
        response.send({error: false, data: results[0], message: 'users list.'});
        response.status(200).end("Success => User Select Query");
      });
});


module.exports = router;