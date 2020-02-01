/* ==================== START modules ==================== */

const { ErrorHandler }      = require('../costomModules/customError')
const isEmpty               = require('../costomModules/valueCheck')
const Review                = require('../dao/reviewDao.js');
const util                  = require('../costomModules/util')

/* ==================== END modules ==================== */

exports.reviewCreate = function(request, response, next) { 
    // let memberNumber = request.params.memberNumber
    let images = request.files
    const setValues = {
        content
    } = request.body
    // console.log("|||||||||||||||||| " + isLoginCheck(email))

    // console.log("|||||||||||||||||| " + util.isLoginCheck(email))
    // if (email != util.isLoginCheck(email)) {
    //     throw new ErrorHandler(404, "User does not 존재")
    // }
    // isEmpty('email', email)
    
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

    isEmpty('content', content)
    console.log(content)

    Review.insertReview([content, setImagesValues], function(error, results) {
        if (error) {
            console.log(__filename + ", Review.insertReview() error status code 500 !!!")
            return next(new ErrorHandler(500, error))
        }
        response.status(200).send(results)
    })
}

exports.reviewReadAll = function(request, response, next) {
    Review.selectAllReview(function(error, results) {
        if (error) {
            console.log(__filename + ", Review.selectAllReview() error status code 500 !!!")
            return next(new ErrorHandler(500, error))
        }
        response.status(200).send(results)
    })
}