/* ==================== START modules ==================== */

const review_controller         = require('../../controller/reviewController');
const express                   = require('express');
const router                    = express.Router();
const util                      = require('../../costomModules/util')
const multer                    = require('multer');
const path                      = require('path');

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
        files: 4,                    // 최대 업로드 개수
        fileSize: 1024 * 1024 * 1024 // 파일 사이즈
    }
})

router.post('/', upload.array('images', 4), review_controller.reviewCreate)                // 리뷰 생성
router.get('/', review_controller.reviewReadAll)                                           // 리뷰 전체 조회

module.exports = router;