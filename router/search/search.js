/* ==================== START modules ==================== */

const express               = require('express');
const router                = express.Router();
const searchController      = require('../../controller/searchController');

/* ==================== END modules ==================== */

router.get('/place/:name', searchController.searchByPlaceName)              // 장소명 검색
router.get('/area/:name', searchController.searchByAreaName)                // 지역명 검색
router.get('/keyword/:name', searchController.searchByKeywordName)          // 키워드명 검색

module.exports = router;