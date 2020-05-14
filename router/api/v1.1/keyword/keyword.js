const keywordController     = require('../../../../controller/v1.1/keywordController')
const express               = require('express')
const router                = express.Router()

router.get('/', keywordController.keywordReadAll)           // 키워드 전체 조회
router.get('/rank', keywordController.keywrodReadByRank)    // 키워드 랭킹별 조회

module.exports = router