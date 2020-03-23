const place_controller          = require('../../controller/placeController')
const review_controller         = require('../../controller/reviewController')
const express                   = require('express')
const router                    = express.Router()
const multer                    = require('multer')
const path                      = require('path')

let storage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, 'public/uploads')
    },
    filename: function (request, file, callback) {
        let extension = path.extname(file.originalname)
        let basename = path.basename(file.originalname, extension)
        callback(null, basename + '-' + Date.now() + '-' + extension)
    }    
})

let fileFilter = function(request, file, callback) {
    var extension = path.extname(file.originalname).toLocaleLowerCase()
    if(extension !== '.png' && extension !== '.jpg' && extension !== '.jpeg') {   
        return callback(new Error('Only images are allowed'))
    }
    callback(null, true)
}

let upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        files: 4,             
        fileSize: 1024 * 1024 * 1024 
    }
}).array('images', 4)


/* ==================== review router ==================== */
router.get('/:placeNumber/review', review_controller.reviewReadByPlace)                           // 장소의 리뷰 전체 조회(장소의 리뷰 목록 조회)
router.post('/:placeNumber/review', (request, response, next) => {
    upload(request, response, (error) => {
        if(error) {
            response.status(404).send('Please images type check')
        } else {
            next()
        }
    })
}, review_controller.reviewCreate)                                                                // 리뷰생성
router.get('/:placeNumber/review/:reviewNumber', review_controller.reviewReadOneByPlace)          // 장소의 리뷰 한개 조회(특정리뷰조회)
router.delete('/:placeNumber/review/:reviewNumber', review_controller.reviewDelete)               // 장소의 리뷰 삭제

/* ==================== place router ==================== */
router.post('/', (request, response, next) => {
    upload(request, response, (error) => {
        if(error) {
            response.status(404).send('Please images type check')
        } else {
            next()
        }
    })
}, place_controller.place_create)                                                      // 장소생성 (이미지)
router.get('/duplicate-check', place_controller.placeDuplicateCheck)                   // 장소 중복확인
router.get('/:placeNumber' , place_controller.place_readOne)                           // 장소한개조회
router.get('/', place_controller.place_readAll)                                        // 장소전체조회
router.put('/:placeNumber',(request, response, next) => {
    upload(request, response, (error) => {
        if(error) {
            response.status(404).send('Please images type check')
        } else {
            next()
        }
    })
}, place_controller.place_update)                                                      // 장소수정
router.delete('/:placeNumber', place_controller.place_delete)                          // 장소삭제
router.get('/:latitude/:longitude', place_controller.place_getCutrrentLocation)        // 장소 현재위치 

module.exports = router
