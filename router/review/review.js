/* ==================== START modules ==================== */

const review_controller         = require('../../controller/reviewController')
const express                   = require('express')
const router                    = express.Router()

/* ==================== END modules ==================== */

router.get('/', review_controller.reviewReadAll)                                                             // 장소의 리뷰목록 조회

// router.post('/:placeNumber/review')
// router.get('/:placeNumber/review')
// router.get('/:placeNumber/review/:reviewNumber')
// 생성
// /place/:placeNumber/review

// 조회 : 장소번호, 리뷰번호 get
// /place/:placeNumber/review
// /place/:placeNumber/review/:reviewNumber
// 삭제 : 
// /place/:placeNumber/review/:reviewNumber

// router.get('/:memberNumber/review')
// router.get('/:memberNumber/review/:reviewNumber')
// 조회 : 회원번호, 리뷰번호 get
// /user/:memberNumber/review
// /user/:memberNumber/review/:reviewNumber
// 삭제 : 
// /user/:memberNumber/review/:reivewNumber

module.exports = router