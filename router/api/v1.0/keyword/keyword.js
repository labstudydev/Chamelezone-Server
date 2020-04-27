const keywordController     = require('../../../../controller/v1.0/keywordController')
const express               = require('express')
const router                = express.Router()

router.get('/', keywordController.keywordReadAll)           // 키워드 전체 조회

module.exports = router