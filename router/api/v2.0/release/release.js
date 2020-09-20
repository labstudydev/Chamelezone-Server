const releaseController         = require('../../../../controller/v2.0/releaseController')
const express                   = require('express')
const router                    = express.Router()

router.get('/apkVersion', releaseController.getApkVersion)

module.exports = router