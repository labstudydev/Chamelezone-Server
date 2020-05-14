const { ErrorHandler }      = require('../../costomModules/customError')
const Course                = require('../../dao/v1.1/courseDao.js')
const isEmpty               = require('../../costomModules/valueCheck')
const Step					= require('step')
const util                  = require('../../costomModules/util')

exports.courseCreate = function([memberNumber, title, content, setImageArray, setPlaceNumberValues], response, next) {
    try {
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
                    response(null, 400)
                }
    
                if (result == true) {
                    Course.insertCourse([memberNumber, title, content, setImageArray, setPlaceNumberValues], function(error, results) {
                        if (error) { return response(error, null) }
                        response(null, results)
                    })
                }
            }
        )    
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

exports.courseReadAll = function(request, response, next) {
    try {
        Course.selectAllCourse(function(error, results) {
            if (error) { return response(error, null) }
            response(null, results)
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

exports.courseReadOne = function([courseNumber, memberNumber], response, next) {
    try {
        Course.selectOneCourse([courseNumber], function(error, results) {
            if (error) { return response(error, null) }
            response(null, results)
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

exports.courseListUser = function([memberNumber], response, next) {
    try {
        Course.selectAllByUser([memberNumber], function(error, results) {
            if (error) { return response(error, null) }
            response(null, results)
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

exports.courseDelete = function([courseNumber, memberNumber], response, next) {
    try {
        Course.deleteCourse([courseNumber, memberNumber], function(error, results) {
            if (error) { return response(error, null) }
            response(null, results)
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

exports.courseUpdate = function([courseNumber, imageNumber, memberNumber, title, content, placeNumber, savedImageName, setImageArray], response, next) {
    try {
        Step(
            function placeNumberCheck() {
                Course.selectOneCourse([courseNumber], this)
            },
            function updateCourse(error, result) {
                if (error) {
                    throw new ErrorHandler(500, error)
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
                        response(null, "INSERT SUCCESS")
                    })
                }
    
                if (result.updateFlag === false) {
                    Course.deleteCourseHasPlace([result.coursePlaceNumberFlag], function(error, results) {
                        if (error) { return next(new ErrorHandler(500, error)) }
                        response(null, "DELETE SUCCESS")
                    })
                }
    
                if (result.updateFlag === 0) {
                    response(null, 200)
                }
            }
        )   
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}