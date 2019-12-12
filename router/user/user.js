/* ==================== START modules ==================== */

const express               = require('express');
const router                = express.Router();
const bodyParser            = require('body-parser');
const user_controller       = require('../../controller/userController');

/* ==================== END modules ==================== */

router.post('/' , user_controller.user_create);                 // 회원가입
router.get('/login', user_controller.user_login);               // 로그인   ==>> 재구현
router.get('/:memberNumber', user_controller.user_detail);      // 회원한명조회
router.put('/:memberNumber', user_controller.user_update);      // 회원수정
router.delete('/:memberNumber', user_controller.user_delete);   // 회원삭제

// querystring(path URL) & semantic(clean URL)
// url and path difference
// request.query.#### & request.params.####

// remember the moment lib
// current datetime npm node-datatime
// data formatt = ####-##-##
var datetime = require('node-datetime');
var dt = datetime.create();
var formatted = dt.format('Y-m-d');

module.exports = router;