/* ==================== START modules ==================== */

const user_controller           = require('../../controller/userController')
const review_controller         = require('../../controller/reviewController')
const like_controller           = require('../../controller/likeController')
const place_controller          = require('../../controller/placeController')
const express                   = require('express')
const router                    = express.Router()
const bodyParser                = require('body-parser')

/* ==================== END modules ==================== */

router.post('/', user_controller.user_create)                       // 회원가입
router.post('/login', user_controller.user_login)                   // 로그인
router.get('/:memberNumber', user_controller.user_detail)           // 회원한명조회
router.put('/:memberNumber', user_controller.user_update)           // 회원수정
router.delete('/:memberNumber', user_controller.user_delete)        // 회원삭제

/* ==================== review router ==================== */
router.get('/:memberNumber/review', review_controller.reviewReadByUser)    // 회원의 리뷰목록 조회

/* ==================== like router ==================== */
router.post('/:memberNumber/like', like_controller.likeAddPlace)           // 좋아요 실행
router.delete('/:memberNumber/like', like_controller.likeCancelPlace)      // 좋아요 취소

/* ==================== place router ==================== */                    

module.exports = router