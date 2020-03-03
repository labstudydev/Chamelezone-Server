/* ==================== START modules ==================== */

const mapController     = require('../../controller/mapController')
const express           = require('express')
const router            = express.Router()
const fs                = require('fs')

/* ==================== END modules ==================== */

router.get('/place/:name', mapController.mapSearchPlaceByName)           // 이름으로 검색

router.get("/map", (request, response) => {
    response.writeHead(200, {
        'Content-Type' : text/html
    })
    fs.readFile('../views/index.html', null, function(error, data) {
        if (error) {
            response.writeHead(404)
            response.write("404 not found!")
        }
        response.end(data)
    })
    // response.end(fs.readFileSync(__dirname + './views/map.html'))
    response.sendFile(path.join(__dirname, '../views/map.html'))
    response.status(200).end("map get success")
})

module.exports = router
