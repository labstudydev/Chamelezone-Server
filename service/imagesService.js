/* ==================== START modules ==================== */

const { ErrorHandler, handleError } = require('../costomModules/customError')
const Images            = require('../dao/imagesDao.js')
const isEmpty           = require('../costomModules/valueCheck')

/* ==================== END modules ==================== */

exports.uploadImageFile = function(request, response, next) {
    const files = request.files
    isEmpty('files', files[0])
    
    let originalFileName, savedFileName, mimetype, fileSize

    files.forEach((item, index, array) => {
        originalFileName = array[index] = item.originalname;
        savedFileName = array[index] = item.filename;
        mimetype = array[index] = item.mimetype;
        fileSize = array[index] = item.size;
        console.log("file: " + index + ": " + originalFileName + " || " + savedFileName + " || " + mimetype + " || " + fileSize)
    })

    Images.uploadImageFile([originalFileName, savedFileName, mimetype, fileSize], function(error, images) {
        if (error) {
            console.log(__filename + ", Images.uploadImageFile() error status code 500 !!!")
            return next(new ErrorHandler(500, error))
        }
        response.status(200).send(images)
    })
}

exports.getImageFile = function(request, response, next) {
    const placeNumber = request.params.placeNumber
    isEmpty('placeNumber', placeNumber)

    Images.getImageFile(placeNumber, function(error, images) {
        if (error) {
            console.log(__filename + ", Images.getImageFile() error status code 500 !!!")
            return next(new ErrorHandler(500, error))
        }
        response.status(200).send(images)
    })
}