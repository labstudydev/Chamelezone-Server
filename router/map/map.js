/* ==================== START modules ==================== */

const express       = require('express');
const router        = express.Router();
const bodyParser    = require('body-parser');
const fs = require('fs');

/* ==================== END modules ==================== */

router.get("/", (request, response) => {
    response.writeHead(200, {
        'Content-Type' : text/html
    });
    fs.readFile('../views/index.html', null, function(error, data) {
        if (error) {
            response.writeHead(404);
            response.write("404 not found!");
        }
        response.end(data);
    });
    // response.end(fs.readFileSync(__dirname + './views/map.html'));
    response.sendFile(path.join(__dirname, '../views/map.html'));
    response.status(200).end("map get success");
});


module.exports = router;