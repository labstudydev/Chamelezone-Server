const mapController     = require('../../../../controller/v1.0/mapController')
const express           = require('express')
const router            = express.Router()
const fs                = require('fs')

router.get('/place/:name', mapController.mapSearchPlaceByName)           // 이름으로 검색

module.exports = router
