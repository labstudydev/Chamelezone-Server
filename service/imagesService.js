/* ==================== START modules ==================== */

const str2json = require('string-to-json')
const Images = require('../dao/imagesDao.js')
const multer = require('multer')
// const upload = multer({dest: '/uploads/'})
// const upload = multer({dest: '../public/uploads'})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../public/uploads') // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname) // cb 콜백함수를 통해 전송된 파일 이름 설정
    }
})

const upload = multer({ storage: storage })

/* ==================== END modules ==================== */

exports.getImageFile = function(request, response, next) {
    let fileName = request.body.fileName
    console.log(__filename + " fileName : " + fileName)

    Images.getImageFile(fileName, function(error, images) {
        if (error) {
            error.status(500)
            error.message = str2json.convert({"status": 500, "message": error.message})
            next(error)
        }
        
        const result = str2json.convert({"status": 200, "data": images})
        response.send(result)
    })
}