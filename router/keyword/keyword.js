/* ==================== START modules ==================== */

const express               = require('express');
const router                = express.Router();
const keywordController     = require('../../controller/keywordController');

/* ==================== END modules ==================== */

router.get('/', keywordController.keyword_readAll)           // 키워드 전체 조회

module.exports = router;