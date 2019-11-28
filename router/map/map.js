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


router.get("/map", (request, response) => {
    response.writeHead(200, {
        'Content-Type' : text/html
    });
    fs.readFile('../views/index.html', null, function(error, data) {
        if (error) {
            response.writeHead(404);
            response.write("404 not found!");
        }
        else {
            response(data);
        }
        response.end();
    });
    // response.end(fs.readFileSync(__dirname + './views/map.html'));
    response.sendFile(path.join(__dirname, '../views/map.html'));
    response.status(200).end("map get success");
});


module.exports = router;