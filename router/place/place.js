/* ==================== START modules ==================== */

const express       = require('express');
const app           = express();
const router        = express.Router();
const bodyParser    = require('body-parser');

const place_controller = require('../../controller/placeController');
/* ==================== END modules ==================== */

router.post('/', place_controller.place_create);                    // 장소생성
router.get('/:placeNumber' , place_controller.place_readOne);       // 장소한개조회
router.get('/', place_controller.place_readAll);                    // 장소전체조회
router.put('/:placeNumber', place_controller.place_update);         // 장소수정
router.delete('/:placeNumber', place_controller.place_delete);      // 장소삭제

module.exports = router;