/* ==================== START modules ==================== */

const course_controller          = require('../../controller/courseController')
const express                   = require('express')
const router                    = express.Router()
const multer                    = require('multer')
const path                      = require('path')

/* ==================== END modules ==================== */

let storage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, 'public/uploads') // callback 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
    },
    filename: function (request, file, callback) {
        // cb 콜백함수를 통해 전송된 파일 이름 설정
        //file.originalname 원래 파일이름
        //callback(null, file.originalname + Date.now())
        let extension = path.extname(file.originalname)
        let basename = path.basename(file.originalname, extension)
        callback(null, basename + '-' + Date.now() + '-' + extension)
    }    
})

let upload = multer({
    storage: storage,
    limits: {
        files: 1,                    // 최대 업로드 개수
        fileSize: 1024 * 1024 * 1024 // 파일 사이즈
    }
})

router.post('/', upload.single('image'), course_controller.courseCreate)                // 코스 생성
router.get('/', course_controller.courseReadAll)                                        // 코스 목록 조회
router.get('/courseNumber', course_controller.courseReadOne)                            // 코스 한개 조회

module.exports = router