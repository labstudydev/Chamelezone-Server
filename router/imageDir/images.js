/* ==================== START modules ==================== */

const images_controller = require('../../controller/imagesController');
const express       = require('express');
const router        = express.Router();
const multer        = require('multer');
const fs            = require('fs');
const path          = require('path');

var storage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, 'public/uploads') // callback 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
    },
    filename: function (request, file, callback) {
        // cb 콜백함수를 통해 전송된 파일 이름 설정
        //file.originalname 원래 파일이름
        //callback(null, file.originalname + Date.now())
        var extension = path.extname(file.originalname)
        var basename = path.basename(file.originalname, extension)
        callback(null, basename + '-' + Date.now() + '-' + extension)
    }    
})

var upload = multer({
    storage: storage,
    limits: {
        files: 4,                    // 최대 업로드 개수
        fileSize: 1024 * 1024 * 1024 // 파일 사이즈
    }
})

/* ==================== END modules ==================== */

router.get('/:placeNumber', images_controller.images_getImageFile)                                    // 이미지 출력
router.post('/', upload.array('photo', 4), images_controller.images_uploadImageFile)      // 장소 이미지 업로드

module.exports = router;