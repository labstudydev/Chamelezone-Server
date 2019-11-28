/* ==================== START modules ==================== */
const express       = require('express');
// const app           = express();
const router        = express.Router();
const bodyParser    = require('body-parser');
const user_controller = require('../../controller/userController');
/* ==================== END modules ==================== */

router.get('/signUp' , user_controller.user_create);            // 회원가입
router.get('/:memberNumber', user_controller.user_detail);      // 회원한명
router.post('/', user_controller.user_login);                   // 로그인
router.put('/:memberNumber', user_controller.user_update);      // 회원수정
router.delete('/:memberNumber', user_controller.user_delete);   // 회원삭제


// // sign up
// router.post("/signUp", (request, response) => {
//     // let sqlQuery = 'INSERT INTO member (email, password, name, nickName, phoneNumber, regiDate) VALUES (?, ?, ?, ?, ?, ?)'
//     // var email = request.body.email;
//     // var password = request.body.password;
//     // var name = request.body.name;
//     // var nickName = request.body.nickName;
//     // var phoneNumber = request.body.phoneNumber;
//     // var regiDate = request.body.regiDate;
//     // [email, password, name, nickName, phoneNumber, regiDate]
    
//     // VALUES는 각 변수를 PARAM으로 이용하였다.
//     // SET은 각 변수를 객를 PARAM으로 이용하였다.
    
//     let sqlQuery = 'INSERT INTO member SET ?';
//     var setValues = {
//         'email': request.body.email,
//         'password': request.body.password,
//         'name': request.body.name,
//         'nickName': request.body.nickName,
//         'phoneNumber': request.body.phoneNumber
//     };

//     connection.query(sqlQuery, setValues, function(error, results, fields){
//         if (error) {
//             response.status(500).end("Server Error");
//             console.log(error);
//         } else {
//             response.status(200).end("Success => User Insert Query");
//             console.log("member index number => " + results.insertId);
//             console.log(results);
//         }
//     });
// });

// // member read one
// router.get("/:memberNumber", (request, response) => {
//     let memberNumber = request.params.memberNumber;
//     let sqlQuery = 'SELECT * FROM member WHERE memberNumber=?';
    
//     connection.query(sqlQuery, memberNumber, function (error, results, fields) {
//         if (error) {
//             response.status(500).end("Server Error");
//             console.log(error);
//         } 
//         console.log(results);
//         response.send({error: false, data: results[0], message: 'users list.'});
//         response.status(200).end("Success => User Select Query");
//       });
// });

// // login
// router.post("/", (request, response) => {
//     let email = request.body.email;
//     let password = request.body.password;
//     let sqlQuery = 'select * from member where email = ? && password = ?';

//     connection.query(sqlQuery, [email, password], function(error, results, fields) {
//         if (error) {
//             response.status(500).end("Server Error");
//             console.log("##### login error #####");
//             console.log(error);
//         }

//         // result null
//         if (!results[0]) {
//             response.status(500).end("Server Error");
//             return response.send("please check your id.");
//         }
    
//         var user = results[0];
   
//         console.log(results);
//         response.send({error: false, data: results[0], message: 'users list.'});
//         response.status(200).end("Success => User login Query");
//     });
// });

// // member update
// router.put("/:memberNumber", (request, response) => {
//     let memberNumber = request.params.memberNumber;
//     let sqlQuery = 'UPDATE member SET password=?, nickName=?, phoneNumber=? WHERE memberNumber=?';
    
//     var password = request.body.password;
//     var nickName = request.body.nickName;
//     var phoneNumber = request.body.phoneNumber;

//     connection.query(sqlQuery, [password, nickName, phoneNumber, memberNumber], function(error, results, fields) {
//         if (error) {
//             response.status(500).end("Server Error");
//             console.log(error);
//         } else {
//             response.status(200).end("Success => User Update Query");
//             console.log("member index number => " + results.insertId);
//             console.log(results);
//         }
//     });
// });


// // member delete
// router.delete("/:memberNumber", (request, response) => {
//     let memberNumber = request.params.memberNumber;
//     let sqlQuery = 'DELETE FROM member WHERE memberNumber=?';

//     connection.query(sqlQuery, memberNumber, function(error, result, fields){
//         if (error) {
//             response.status(500).end('Server Error');
//             console.log(error);;
//         } else {
//             response.status(200).end("Success => User Delete Query");
//             console.log("member index number => " + result.insertId);
//             console.log(result);
//         }
//     });
// });

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