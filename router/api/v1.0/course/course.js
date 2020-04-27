const courseController          = require('../../../../controller/v1.0/courseController')
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
        console.log("Images - decodeOriginalName: ", decodeOriginalName)
        let extension = path.extname(file.originalname)
        let basename = path.basename(decodeOriginalName, extension)
        console.log("Images - basename: ", basename)
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
        files: 1,
        fileSize: 1024 * 1024 * 1024
    }
}).single('image')

router.post('/', (request, response, next) => {
    upload(request, response, (error) => {
        if(error) {
            response.status(404).send('Please images type check')
        } else {
            next()
        }
    })
}, courseController.courseCreate)                                        // 코스 생성
router.get('/', courseController.courseReadAll)                          // 코스 목록 조회
router.get('/:courseNumber', courseController.courseReadOne)             // 코스 한개 조회
router.delete('/:courseNumber',courseController.courseDelete)            // 코스 삭제
router.put('/:courseNumber', (request, response, next) => {              // 코스 수정
    upload(request, response, (error) => {
        if(error) {
            response.status(404).send('Please image type check')
        } else {
            next()
        }
    })
}, courseController.courseUpdate)                                  

module.exports = router
