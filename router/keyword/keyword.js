const keywordController     = require('../../controller/keywordController')
const express               = require('express')
const router                = express.Router()

router.get('/', keywordController.keyword_readAll)           // 키워드 전체 조회

module.exports = router