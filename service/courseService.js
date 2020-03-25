const { ErrorHandler }      = require('../costomModules/customError')
const Course                = require('../dao/courseDao.js')
const isEmpty               = require('../costomModules/valueCheck')
const Step					= require('../node_modules/step')
const util                  = require('../costomModules/util')

exports.courseCreate = function(request, response, next) {
    const image = request.file
    const setValues = {
        memberNumber, title, content, placeNumber
    } = request.body
    const nullValueCheckObject = {
        placeNumber, memberNumber, title, content
    }
    isEmpty(nullValueCheckObject)

    console.log("Course create image == ", image)

    let setImageArray = new Array(4)
    setImageArray[0] = image.originalname
    setImageArray[1] = image.filename
    setImageArray[2] = image.mimetype
    setImageArray[3] = image.size

    let placeNumberArraySize = placeNumber.length
    let setPlaceNumberValues = new Array(placeNumberArraySize)

    for (i = 0; i < placeNumberArraySize; i++) {
        setPlaceNumberValues[i] = new Array(1)
    }

    placeNumber.forEach((item, index, array) => {
        setPlaceNumberValues[index][0] = item
    })

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
    const nullValueCheckObject = {
        courseNumber
    }
    isEmpty(nullValueCheckObject)

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
    const nullValueCheckObject = {
        memberNumber
    }
    isEmpty(nullValueCheckObject)

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
    let memberNumber = request.query.memberNumber
    
    const nullValueCheckObject = {
        courseNumber, memberNumber
    }
    isEmpty(nullValueCheckObject)

    Course.deleteCourse([courseNumber, memberNumber], function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }

        response.status(200).send(results)
    })
}

/*
    course : 코스 제목, 설명
    course_images : 사진
    course_has_place : 장소
*/
exports.courseUpdate = function(request, response, next) {
    let image = request.file
    let courseNumber = request.params.courseNumber
    const setValues = {
        coursePlaceNumber, imageNumber, memberNumber, title, content, placeNumber
    } = request.body

    const nullValueCheckObject = {
        courseNumber
    }
    isEmpty(nullValueCheckObject)
    
    let setImageArray = new Array(4)
    setImageArray[0] = image.originalname
    setImageArray[1] = image.filename
    setImageArray[2] = image.mimetype
    setImageArray[3] = image.size
    
    console.log("placeNumber : ", placeNumber)

    Step (
        function courseEditCheck() {
            Course.selectCheckCourse([courseNumber], this)
        },
        function courseEditCheckResult(error, result) {
            if (error) {
				throw new ErrorHandler(500, error)
            }

            if (result[0] == null || result[0] == undefined) {
                response.status(404).send("Course does not exist")
            } else {
                return result[0]
            }
        },
        // 코스수정
        function updateCourse(error, result) {
            if (error) {
				throw new ErrorHandler(500, error)
            }
            
            title = (!title) ? result.title : title
            content = (!content) ? result.content : content
            console.log("update course= ============================================ ")
            console.log("Original Values == ", result.title, ", ", result.content)
            console.log("Update Values == ", title, ", ", content)
            
            Course.updateCourse([title, content, courseNumber, memberNumber], this)
        },
        // 코스 이미지 수정
        function courseImageEditCheck(error, result) {
            if (error) {
				throw new ErrorHandler(500, error)
            }

            Course.selectCheckCourseImage([courseNumber], this)
        },
        function courseImageEditCheckResult(error, result) {
            if (error) {
				throw new ErrorHandler(500, error)
            }
            
            if (result[0] == null || result[0] == undefined) {
                response.status(404).send("Course Image does not exist")
            } else {
                return result[0]
            }
        },
        function updateCourseImage(error, result) {
            if (error) {
				throw new ErrorHandler(500, error)
            }
            
            originalImageName = (!setImageArray[0]) ? result.originalImageName : setImageArray[0]
            savedImageName = (!setImageArray[1]) ? result.savedImageName : setImageArray[1]
            mimetype = (!setImageArray[2]) ? result.mimetype : setImageArray[2]
            imageSize = (!setImageArray[3]) ? result.imageSize : setImageArray[3]

            console.log("update course image ============================================== ")
            console.log("Original Values == ", result.originalImageName, ", ", result.savedImageName, ", ", result.mimetype, ", ", result.imageSize)
            console.log("Update Values == ", originalImageName, ", ", savedImageName, ", ", mimetype, ", ", imageSize)

            Course.updateCourseImage([originalImageName, savedImageName, mimetype, imageSize, courseNumber, imageNumber], this)
        },
        // 코스의 장소 수정
        function courseHasPlaceEditCheck(error, result) {
            if (error) {
                throw new ErrorHandler(500, error)
            }

            Course.selectCheckCourseHasPlace([courseNumber], this)
        },
        function courseHasPlaceEditCheckResult(error, result) {
            if (error) {
				throw new ErrorHandler(500, error)
            }
            
            if (result[0] == null || result[0] == undefined) {
                response.status(404).send("Course Has Place does not exist")
            } else {
                return result
            }
        }, function updateCourseHasPlace(error, result) {
            if (error) {
				throw new ErrorHandler(500, error)
            }

            console.log(result)
            console.log(placeNumber)
            console.log(coursePlaceNumber)
            placeNumber.forEach((item, index, array) => {
                placeNumber[index] = (!placeNumber[index]) ? result[index].placeNumber : placeNumber[index]
                console.log("update course has place ============================================== ")
                console.log("Original Values == ", result[index].placeNumber)
                console.log("Update Values == ", placeNumber[index])
                console.log("coursePlaceNumber == ", coursePlaceNumber[index])
            })

            for(i = 0; i < placeNumber.length; i++) {
                Course.updateCourseHasPlace([placeNumber[i], courseNumber, coursePlaceNumber[i]], this)
            }

            response.status(200).send("Success !!!")
        }
    )
}
