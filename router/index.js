/* ==================== START modules ==================== */
const express       = require('express');
const app           = express();
const router        = express.Router();
const path          = require('path');
const user          = require('./user/user');
const place         = require('./place/place');
/* ==================== END modules ==================== */

// url routing
router.get("/", (request, response) => {
    response.sendFile(path.join(__dirname, '../views/index.hbs'));
    response.status(200).end("router get success");
});

router.get("/map", (request, response) => {
    response.writeHead(200, {
        'Content-Type' : text/html
    });
    fs.readFile('../views/index.html', null, function(error, data) {
        if (error) {
            response.writeHead(404);
            response.write("404 not found!");
        }
        else {
            response(data);
        }
        response.end();
    });
    // response.end(fs.readFileSync(__dirname + './views/map.html'));
    response.sendFile(path.join(__dirname, '../views/map.html'));
    response.status(200).end("map get success");
});

/* ==================== START router ==================== */
router.use("/user", user);          // 회원
router.use("/place", place);        // 장소
// router.use("/user/signUp", user.signUp);        // 회원가입
// router.use("/user/signIn", user.login);          // 로그인
// router.use("/user/:memrouter get successberNumber", user.list);      // 특정 회원조회
// router.use("/user/:memberNumber", user.update);    // 회원수정
// router.use("/user/:memberNumber", user.delete); // 회원삭제
/* ==================== END router ==================== */

module.exports = router;