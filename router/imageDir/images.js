/* ==================== START modules ==================== */

const express       = require('express');
const router        = express.Router();
const images_controller = require('../../controller/imagesController');
const multer = require('multer');
// const upload = multer({dest: '/uploads/'});
// const upload = multer({dest: '../public/uploads'});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../public/uploads') // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) // cb 콜백함수를 통해 전송된 파일 이름 설정
  }
})
var upload = multer({ storage: storage })

/* ==================== END modules ==================== */

router.post('/', upload.single('fileName'), images_controller.images_getImageFile);     // 장소 이미지 업로드

module.exports = router;