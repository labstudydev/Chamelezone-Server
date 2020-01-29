/* ==================== START modules ==================== */

const place_controller = require('../../controller/placeController');
const express       = require('express');
const router        = express.Router();
const multer        = require('multer');
const path          = require('path');

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

router.post('/', upload.array('images', 4), place_controller.place_create);             // 장소생성 (이미지)
router.get('/:placeNumber' , place_controller.place_readOne);                           // 장소한개조회
router.get('/', place_controller.place_readAll);                                        // 장소전체조회
router.put('/:placeNumber', place_controller.place_update);                             // 장소수정
router.delete('/:placeNumber', place_controller.place_delete);                          // 장소삭제
router.get('/:latitude/:longitude', place_controller.place_getCutrrentLocation);        // 장소 현재위치 

module.exports = router;
