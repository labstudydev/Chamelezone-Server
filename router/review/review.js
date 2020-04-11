const reviewController          = require('../../controller/reviewController')
const express                   = require('express')
const router                    = express.Router()

router.get('/', reviewController.reviewReadAll)                  // 장소의 리뷰 목록 조회

module.exports = router