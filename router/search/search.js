/* ==================== START modules ==================== */

const express               = require('express');
const router                = express.Router();
const searchController     = require('../../controller/searchController');

/* ==================== END modules ==================== */

router.get('/:name', searchController.searchByName)           // 이름으로 검색

module.exports = router;