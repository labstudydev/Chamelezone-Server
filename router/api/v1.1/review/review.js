const reviewController          = require('../../../../controller/v1.1/reviewController')
const express                   = require('express')
const router                    = express.Router()

router.get('/', reviewController.reviewReadAll)                  // 장소의 리뷰 목록 조회

module.exports = router