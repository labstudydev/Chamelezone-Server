const { ErrorHandler }      = require('../../costomModules/customError')
const Course                = require('../../dao/v2.0/courseDao.js')
const isEmpty               = require('../../costomModules/valueCheck')
const Step					= require('step')
const util                  = require('../../costomModules/util')

exports.courseCreate = function(request, response, next) {
    const image = request.file
    const setValues = {
        memberNumber, title, content, placeNumber
    } = request.body
    const nullValueCheckObject = {
        placeNumber, memberNumber, title, content
    }
    isEmpty(nullValueCheckObject)

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

    Step (
        function courseDuplicateCheck() {
            Course.selectCourseDuplicateCheck([memberNumber, title, content], this)
        },
        function courseDuplicateCheckResult(error, result) {
            if (error) {
				throw new ErrorHandler(500, error)
            }

            if(result.length == 0 || result.length == undefined) {
                return true
            } else {
                return false
            }
        },
        function createCourse(error, result) {
            if (error) {
				throw new ErrorHandler(500, error)
            }

            if (result == false) {
                response.status(400).send("Create course duplicate")
            }

            if (result == true) {
                Course.insertCourse([memberNumber, title, content, setImageArray, setPlaceNumberValues], function(error, results) {
                    if (error) {
                        return next(new ErrorHandler(500, error))
                    }
                    response.status(200).send(results)
                })
            }
        }
    )
}

exports.courseReadAll = function(request, response, next) {
    Course.selectAllCourse(function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }

        if (results.length == 0 || results.length == undefined) {
            response.status(404).send("Course list does not exist")
        } else {
            response.status(200).send(results)
        }
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
        if (results.length == 0 || results.length == undefined) {
            response.status(404).send("Course does not exist")
        } else {
            response.status(200).send(results)
        }
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

exports.courseUpdate = function(request, response, next) {
    let image = request.file
    let courseNumber = request.params.courseNumber
    const setValues = {
        imageNumber, memberNumber, title, content, placeNumber, savedImageName
    } = request.body

    const nullValueCheckObject = {
        courseNumber, memberNumber, title, content, placeNumber
    }

    isEmpty(nullValueCheckObject)
    
    let setImageArray = new Array(4)
    if (image != undefined) {    
        setImageArray[0] = image.originalname
        setImageArray[1] = image.filename
        setImageArray[2] = image.mimetype
        setImageArray[3] = image.size
    }

    Step(
        function placeNumberCheck() {
            Course.selectOneCourse([courseNumber], this)
        },
        function updateCourse(error, result) {
            if (error) {
                throw new ErrorHandler(404, "Course list does not exist")
            }
                        
            title = (title == result[0].title) ? result[0].title : title
            content = (content == result[0].content) ? result[0].content : content
                        
            let originalImageName, requestSavedImageName, mimetype, imageSize
            if(savedImageName == result[0].courseImage) {
                originalImageName = result[0].originalImageName
                requestSavedImageName = result[0].savedImageName
                mimetype = result[0].mimetype
                imageSize = result[0].imageSize
            }

            if (image !== undefined) {
                originalImageName = setImageArray[0]
                requestSavedImageName = setImageArray[1]
                mimetype = setImageArray[2]
                imageSize = setImageArray[3]                
            }

            Course.updateCourseTransaction([title, content, courseNumber, memberNumber, originalImageName, requestSavedImageName, mimetype, imageSize, imageNumber], this)
            return result

        },
        function updateCourseHasPlace(error, result) {
            if (error) {
                throw new ErrorHandler(500, error)
            }

            const placeNumberMap = result.map(result => `${result.placeNumber}`)
            const coursePlaceNumber = new Array(result.length)
            result.forEach((item, index, array) => {
                coursePlaceNumber[index] = result[index].coursePlaceNumber
            })

            const setCourseHasPlaceNumberArray = new Array(placeNumberMap.length)
            for(j = 0; j < placeNumberMap.length; j++) {
                setCourseHasPlaceNumberArray[j] = new Array(1)
            }

            placeNumberMap.forEach((item, index, array) => {
                setCourseHasPlaceNumberArray[index][0] = item
                setCourseHasPlaceNumberArray[index].unshift(courseNumber)
            })

            result.forEach((item, index, array) => {
                placeNumber = (placeNumber == result[index].placeNumber) ? result[index].placeNumber : placeNumber
            })

            let updateFlag, updateCnt, coursePlaceNumberFlag
            if (placeNumber.length == placeNumberMap.length) {
                updateFlag = 0
                updateCnt = placeNumber.length
            }
            if (placeNumber.length > placeNumberMap.length) {
                updateFlag = true
                updateCnt = 2
                coursePlaceNumberFlag = placeNumber[2]
            }
            if (placeNumber.length < placeNumberMap.length) {
                updateFlag = false
                updateCnt = 2
                coursePlaceNumberFlag = result[2].coursePlaceNumber
            }
            
            for(i = 0; i < updateCnt; i++) {
                Course.updateCourseHasPlace([placeNumber[i], courseNumber, coursePlaceNumber[i]], function(error, results) {
                    if (error) { return next(new ErrorHandler(500, error)) }
                })
            }

            let resultValue = {
                updateFlag,
                coursePlaceNumberFlag,
                courseNumber,
                placeNumber
            }

            return resultValue
        },
        function updateCourseHasPlaceTransaction(error, result) {
            if (error) {
                throw new ErrorHandler(500, error)
            }

            if (result.updateFlag === true) {
                Course.insertCourseHasPlace([result.courseNumber, result.coursePlaceNumberFlag], function(error, results) {
                    if (error) { return next(new ErrorHandler(500, error)) }
                    response.status(200).send("Course update success !!!")
                })
            }

            if (result.updateFlag === false) {
                Course.deleteCourseHasPlace([result.coursePlaceNumberFlag], function(error, results) {
                    if (error) { return next(new ErrorHandler(500, error)) }
                    response.status(200).send("Course update success !!!")
                })
            }

            if (result.updateFlag === 0) {
                response.status(200).send("Course update success !!!")
            }
        }
    )
}