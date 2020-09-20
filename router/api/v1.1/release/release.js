const releaseController         = require('../../../../controller/v1.1/releaseController')
const express                   = require('express')
const router                    = express.Router()

router.get('/apkVersion', releaseController.getApkVersion)

module.exports = router