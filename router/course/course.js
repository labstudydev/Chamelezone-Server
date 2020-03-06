const course_controller         = require('../../controller/courseController')
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
}, course_controller.courseCreate)                                        // 코스 생성
router.get('/', course_controller.courseReadAll)                          // 코스 목록 조회
router.get('/:courseNumber', course_controller.courseReadOne)             // 코스 한개 조회
router.delete('/:courseNumber',course_controller.courseDelete)            // 코스 삭제

module.exports = router