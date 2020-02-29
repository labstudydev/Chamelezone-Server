/* ==================== START modules ==================== */

const { ErrorHandler }      = require('../costomModules/customError')
const Course                = require('../dao/courseDao.js')
const isEmpty               = require('../costomModules/valueCheck')
const util                  = require('../costomModules/util')

/* ==================== END modules ==================== */

exports.courseCreate = function(request, response, next) {
    const image = request.file
    const setValues = {
        memberNumber, title, content, placeNumber
    } = request.body

    let setImageArray = new Array(4)
    setImageArray[0] = image.originalname
    setImageArray[1] = image.filename
    setImageArray[2] = image.mimetype
    setImageArray[3] = image.size

    isEmpty('placeNumber', placeNumber)
    let placeNumberArraySize = placeNumber.length
    let setPlaceNumberValues = new Array(placeNumberArraySize)

    for (i = 0; i < placeNumberArraySize; i++) {
        setPlaceNumberValues[i] = new Array(1)
    }

    placeNumber.forEach((item, index, array) => {
        setPlaceNumberValues[index][0] = item
    })

    isEmpty('memberNumber', memberNumber)
    isEmpty('title', title)
    isEmpty('content', content)

    Course.insertCourse([memberNumber, title, content, setImageArray, setPlaceNumberValues], function(error, results) {
        if (error) {
            console.log(__filename + ", Course.insertCourse() error status code 500 !!!")
            return next(new ErrorHandler(500, error))
        }
        response.status(200).send(results)
    })
}

exports.courseReadAll = function(request, response, next) {
    Course.selectAllCourse(function(error, results) {
        if (error) {
            console.log(__filename + ", Course.selectAllCourse() error status code 500 !!!")
            return next(new ErrorHandler(500, error))
        }
        response.status(200).send(results)
    })
}

// 코스를 조회할땐 코스번호, 회원번호가 필요하지
exports.courseReadOne = function(request, response, next) {
    let courseNumber = request.params.courseNumber
    let memberNumber = request.query.memberNumber

    isEmpty('courseNumber', courseNumber)
    console.log("################### request query memberNumber : " + memberNumber)

    Course.selectOneCourse([courseNumber], function(error, results) {
        if (error) {
            console.log(__filename + ", Course.selectOneCourse() error status code 500 !!!")
            return next(new ErrorHandler(500, error))
        }
        
        const array = util.resultStringToArray(results, 'keyword_name')
        
        // results.forEach((target) => {
        //     target.keyword_name  = target.keyword_name.split(",")
        // })

        response.status(200).send(array)
    })
}