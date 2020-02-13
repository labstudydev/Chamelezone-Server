/* ==================== START modules ==================== */

const { ErrorHandler }      = require('../costomModules/customError')
const Course                 = require('../dao/courseDao.js')
const isEmpty               = require('../costomModules/valueCheck')

/* ==================== END modules ==================== */

exports.createCourse = function(request, response, next) {
    const images = request.files
    const setValues = {
        memberNumber, title, content, placeNumber
    } = request.body

    isEmpty('images', images[0])
    let originalImageName, savedImageName, mimetype, imageSize
    
    let iamgesArraySize = images.length
    let setImagesValues = new Array(iamgesArraySize);
    for (i = 0; i < iamgesArraySize; i++) {
        setImagesValues[i] = new Array(4);
    }

    images.forEach((item, index, array) => {
        originalImageName = array[index] = item.originalname;
        savedImageName = array[index] = item.filename;
        mimetype = array[index] = item.mimetype;
        imageSize = array[index] = item.size;
        console.log("images toString: " + index + ": " + originalImageName + " || " + savedImageName + " || " + mimetype + " || " + imageSize)
        
        setImagesValues[index][0] = originalImageName
        setImagesValues[index][1] = savedImageName
        setImagesValues[index][2] = mimetype
        setImagesValues[index][3] = imageSize
    })

    isEmpty('placeNumber', placeNumber)
    let placeNumberArraySize = placeNumber.length
    let setPlaceNumberValues = new Array(placeNumberArraySize);
    for (i = 0; i < placeNumberArraySize; i++) {
        setPlaceNumberValues[i] = new Array(1);
    }

    placeNumber.forEach((item, index, array) => {
        console.log(item)
        setPlaceNumberValues[index][0] = item
    })

    isEmpty('memberNumber', memberNumber)
    isEmpty('title', title)
    isEmpty('content', content)

    Course.insertCourse([memberNumber, title, content, setImagesValues, setPlaceNumberValues], function(error, results) {
        if (error) {
            console.log(__filename + ", Course.insertCourse() error status code 500 !!!")
            return next(new ErrorHandler(500, error))
        }
        response.status(200).send(results)
    })
}