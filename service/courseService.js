const { ErrorHandler }      = require('../costomModules/customError')
const Course                = require('../dao/courseDao.js')
const isEmpty               = require('../costomModules/valueCheck')
const util                  = require('../costomModules/util')

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
            return next(new ErrorHandler(500, error))
        }
        response.status(200).send(results)
    })
}

exports.courseReadAll = function(request, response, next) {
    Course.selectAllCourse(function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }
        response.status(200).send(results)
    })
}

exports.courseReadOne = function(request, response, next) {
    let courseNumber = request.params.courseNumber
    let memberNumber = request.query.memberNumber
    isEmpty('courseNumber', courseNumber)

    Course.selectOneCourse([courseNumber], function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }

        util.resultStringToArray(results, ['keywordName'])
        response.status(200).send(results)
    })
}

exports.courseListUser = function(request, response, next) {
    let memberNumber = request.params.memberNumber
    isEmpty('memberNumber', memberNumber)

    Course.selectAllByUser([memberNumber], function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }

        if (results.length == 0 || results.length == undefined) {
            response.status(404).send("User course list does not exist")
        } else {
            response.status(200).send(results)
        }
    })
}

exports.courseDelete = function(request, response, next) {
    let courseNumber = request.params.courseNumber
    isEmpty('courseNumber', courseNumber)

    let memberNumber = request.query.memberNumber
    isEmpty('memberNumber', memberNumber)

    Course.deleteCourse([courseNumber, memberNumber], function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }

        response.status(200).send(results)
    })
}