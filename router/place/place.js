const placeController           = require('../../controller/placeController')
const reviewController          = require('../../controller/reviewController')
const express                   = require('express')
const router                    = express.Router()
const multer                    = require('multer')
const path                      = require('path')

let storage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, 'public/uploads')
    },
    filename: function (request, file, callback) {
        let decodeOriginalName = decodeURI(file.originalname)
        console.log("TEST -- decodeOriginalName: ", decodeOriginalName)
        let extension = path.extname(file.originalname)
        let basename = path.basename(decodeOriginalName, extension)
        console.log("TEST -- basename: ", basename)
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

let updateUpload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        files: 4,             
        fileSize: 1024 * 1024 * 1024 
    }
}).fields([{ name: 'updateImages', maxCount: 4 },{ name: 'insertImages', maxCount: 4 }])

/* ==================== review router ==================== */
router.get('/:placeNumber/review', reviewController.reviewReadByPlace)                           // 장소의 리뷰 전체 조회(장소의 리뷰 목록 조회)
router.post('/:placeNumber/review', (request, response, next) => {
    upload(request, response, (error) => {
        if(error) {
            response.status(404).send('Please images type check')
        } else {
            next()
        }
    })
}, reviewController.reviewCreate)                                                                 // 리뷰생성
router.get('/:placeNumber/review/:reviewNumber', reviewController.reviewReadOneByPlace)           // 장소의 리뷰 한개 조회(특정리뷰조회)
router.put('/:placeNumber/review/:reviewNumber', (request, response, next) => {                   // 장소의 리뷰 수정
    upload(request, response, (error) => {
        if(error) {
            response.status(404).send('Please images type check')
        } else {
            next()
        }
    })
}, reviewController.reviewUpdate)    
router.delete('/:placeNumber/review/:reviewNumber', reviewController.reviewDelete)               // 장소의 리뷰 삭제

/* ==================== place router ==================== */
router.post('/', (request, response, next) => {
    upload(request, response, (error) => {
        if(error) {
            response.status(404).send('Please images type check')
        } else {
            next()
        }
    })
}, placeController.placeCreate)                                                       // 장소생성 (이미지)
router.get('/duplicate-check', placeController.placeDuplicateCheck)                   // 장소 중복확인
router.get('/:placeNumber' , placeController.placeReadOne)                            // 장소한개조회
router.get('/', placeController.placeReadAll)                                         // 장소전체조회
router.put('/:placeNumber',(request, response, next) => {
    updateUpload(request, response, (error) => {
        if(error) {
            response.status(404).send('Please images type check')
        } else {
            next()
        }
    })
}, placeController.placeUpdate)                                                       // 장소수정
router.delete('/:placeNumber', placeController.placeDelete)                           // 장소삭제
router.get('/:latitude/:longitude', placeController.placeGetCutrrentLocation)         // 장소 현재위치 
router.put('/:placeNumber/keyword', placeController.placeKeywordUpdate)               // 장소의 키워드 수정
router.put('/:placeNumber/openingTime', placeController.placeOpeningTimeUpdate)       // 장소의 영업시간 수정

module.exports = router
