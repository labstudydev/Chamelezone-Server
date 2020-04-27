const userController            = require('../../../../controller/v1.0/userController')
const reviewController          = require('../../../../controller/v1.0/reviewController')
const likeController            = require('../../../../controller/v1.0/likeController')
const placeController           = require('../../../../controller/v1.0/placeController')
const courseController          = require('../../../../controller/v1.0/courseController')
const express                   = require('express')
const router                    = express.Router()

/* ==================== user router ==================== */
router.put('/password', userController.userPasswordReset)                      // 회원의 비밀번호 재설정
router.post('/', userController.userCreate)                                    // 회원가입
router.post('/login', userController.userLogin)                                // 로그인
router.get('/:memberNumber', userController.userDetail)                        // 회원한명조회
router.put('/:memberNumber', userController.userUpdate)                        // 회원수정
router.delete('/:memberNumber', userController.userDelete)                     // 회원삭제
router.get('/email/:email', userController.userEmailDuplicateCheck)            // 회원 이메일 중복확인
router.get('/nick-name/:nickName', userController.userNickNameDuplicateCheck)  // 회원 닉네임 중복확인
router.post('/help-email', userController.userEmailFind)                       // 회원의 이메일 찾기
router.post('/help-pw-code', userController.userSendSecurityCode)              // 회원의 비밀번호 찾기 - 보안코드 전송
router.post('/help-pw-code-check', userController.userCheckSecurityCode)       // 회원의 비밀번호 찾기 - 보안코드 확인

/* ==================== review router ==================== */
router.get('/:memberNumber/review', reviewController.reviewReadByUser)         // 회원의 리뷰목록 조회

/* ==================== like router ==================== */
router.post('/:memberNumber/like', likeController.likeAddPlace)                // 좋아요 실행
router.get('/:memberNumber/likes', likeController.likeReadAllByUser)           // 회원의 좋아요 목록
router.delete('/:memberNumber/like', likeController.likeCancelPlace)           // 좋아요 취소

/* ==================== place router ==================== */
router.get('/:memberNumber/place', placeController.placeListUser)              // 회원의 장소 목록 조회

/* ==================== course router ==================== */
router.get('/:memberNumber/course', courseController.courseListUser)           // 회원의 코스 목록 조회

module.exports = router