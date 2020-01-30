/* ==================== START modules ==================== */

const review_controller = require('../../controller/reviewController');
const express       = require('express');
const router        = express.Router();

/* ==================== END modules ==================== */

router.post('/', review_controller.reviewCreate)                // 리뷰 생성

module.exports = router;