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

// place create
// router.post("/", (request, response) => {
//     let sqlQuery = 'INSERT INTO place SET ?';
//     var setValues = {
//         'keywordNumber' : request.body.keywordNumber,
//         'name' : request.body.name,
//         'address' : request.body.address,
//         'openingTime' : request.body.openingTime,
//         'phoneNumber' : request.body.phoneNumber,
//         'content' : request.body.content
//     };
    
//     if (setValues == null) {
//         response.status(404).end("Client Error")
//         console.log(error);
//     } else {
//         connection.query(sqlQuery, setValues, (error, results, fileds) =>{
//             if (error) {
//                 response.status(500).end("Server Error");
//                 console.log(error);
//             } else {
//                 response.status(200).end("Success => Place INSERT Query");
//                 console.log("place index number => " + results.insertId);
//                 console.log(results);
//             }
//         });
//     }
// });

// // place read all
// router.get("/", (request, response) => {
//     let sqlQuery = 'SELECT * FROM place';
    
//     connection.query(sqlQuery, (error, results, fileds) => {
//         if (error) {
//             response.status(500).end("Server Error");
//             console.log(error);
//         } else {
//             response.status(200).end("Success => Place SELECT Query");
//             console.log("place index number => " + results.insertId);
//             console.log(results);
//         }
//     });
// });

// // place read one
// router.get("/:placeNumber", (request, response) => {
//     let placeNumber = request.params.placeNumber;
//     let sqlQuery = 'SELECT * FROM place WHERE placeNumber = ?';

//     connection.query(sqlQuery, placeNumber, (error, results, fileds) => {
//         if (error) {
//             response.status(500).end("Server Error");
//             console.log(error);
//         } else {
//             console.log(results);
//             response.send({error: false, data: results[0], message: 'place list.'});
//             response.status(200).end("Success => Place Select Query");
//         }
//     });
// });

// // place update
// router.put("/:placeNumber", (request, response) => {
//     //아무것도 수정하지 않았을때
//     //값을 수정할때
// })

// // place delete one
// router.delete("/:placeNumber", (request, response) => {
//     let placeNumber = request.params.placeNumber;
//     let sqlQuery = 'DELETE FROM place WHERE placeNumber = ?';

//     connection.query(sqlQuery, placeNumber, (error, results, fileds) => {
//         if (error) {
//             response.status(500).end("Server Error");
//             console.log(error);
//         } else {
//             console.log(results);
//             response.send({error: false, data: results[0], message: 'place list.'});
//             response.status(200).end("Success => Place Select Query");
//         }
//     });
// });


module.exports = router;