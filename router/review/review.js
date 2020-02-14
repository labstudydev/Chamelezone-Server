/* ==================== START modules ==================== */

const review_controller         = require('../../controller/reviewController')
const express                   = require('express')
const router                    = express.Router()

/* ==================== END modules ==================== */

router.get('/', review_controller.reviewReadAll)                  // 장소의 리뷰 목록 조회

module.exports = router