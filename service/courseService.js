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

exports.courseUpdate = function(request, response, next) {
    let image = request.file
    let courseNumber = request.params.courseNumber
    const setValues = {
        imageNumber, memberNumber, title, content, placeNumber
    } = request.body

    const nullValueCheckObject = {
        courseNumber, memberNumber, title, content, placeNumber
    }
    console.log("Request values : ", image, ", ", courseNumber, ", ", imageNumber, ", ", memberNumber, ", ", title, ", ", content, ", ", placeNumber)

    isEmpty(nullValueCheckObject)
    
    let setImageArray = new Array(4)
    setImageArray[0] = image.originalname
    setImageArray[1] = image.filename
    setImageArray[2] = image.mimetype
    setImageArray[3] = image.size
    
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
            originalImageName = (setImageArray[0] == result[0].originalImageName) ? result[0].originalImageName : setImageArray[0]
            savedImageName = (setImageArray[1] == result[0].savedImageName) ? result[0].savedImageName : setImageArray[1]
            mimetype = (setImageArray[2] == result[0].mimetype) ? result[0].mimetype : setImageArray[2]
            imageSize = (setImageArray[3] == result[0].imageSize) ? result[0].imageSize : setImageArray[3]
            console.log("Course and images ToString : ", title, ",", content, ",", originalImageName, ",", savedImageName, ",", mimetype, ",", imageSize)       

            Course.updateCourseTransaction([title, content, courseNumber, memberNumber, originalImageName, savedImageName, mimetype, imageSize, imageNumber], this)

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
                console.log("update service : ", placeNumber[i], courseNumber, coursePlaceNumber[i])
                Course.updateCourseHasPlace([placeNumber[i], courseNumber, coursePlaceNumber[i]], function(error, results) {
                    if (error) { return next(new ErrorHandler(500, error)) }
                    console.log("Update course success !!!")
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

            console.log(result)
            if (result.updateFlag === true) {
                console.log("insert service")
                Course.insertCourseHasPlace([result.courseNumber, result.coursePlaceNumberFlag], function(error, results) {
                    if (error) { return next(new ErrorHandler(500, error)) }
                    response.status(200).send("Course update success !!!")
                })
            }

            if (result.updateFlag === false) {
                console.log("delete service")
                Course.deleteCourseHasPlace([result.coursePlaceNumberFlag], function(error, results) {
                    if (error) { return next(new ErrorHandler(500, error)) }
                    response.status(200).send("Course update success !!!")
                })
            }

            if (result.updateFlag === 0) {
                console.log("Not insert and delete service")
                response.status(200).send("Course update success !!!")
            }
        }
    )
}

/////////////////////////////////////////////////////////////////////////// 20-03-29 수정 
// exports.courseUpdate = function(request, response, next) {
//     let image = request.file
//     let courseNumber = request.params.courseNumber
//     const setValues = {
//         imageNumber, memberNumber, title, content, placeNumber
//     } = request.body

//     const nullValueCheckObject = {
//         courseNumber
//     }
//     isEmpty(nullValueCheckObject)
    
//     let setImageArray = new Array(4)
//     setImageArray[0] = image.originalname
//     setImageArray[1] = image.filename
//     setImageArray[2] = image.mimetype
//     setImageArray[3] = image.size

//     Step (
//         function courseEditCheck() {
//             console.log("1111 ::course = courseEctiCheck()")
//             Course.selectCheckCourse([courseNumber], this)
//         },
//         function courseEditCheckResult(error, result) {
//             /*
//             Course.selectCheckCourse([courseNumber], this) == error
//             */
//             if (error) {
// 				throw new ErrorHandler(500, error)
//             }

//             console.log("2222 ::course = courseEditCheckResult()")
//             if (result[0] == null || result[0] == undefined) {
//                 response.status(404).send("Course does not exist")
//             } else {
//                 return result[0]
//             }
//         },
//         // 코스수정
//         function updateCourse(error, result) {
//             if (error) {
// 				throw new ErrorHandler(500, error)
//             }
//             console.log("3333 ::course = updateCourse()")
//             title = (!title) ? result.title : title
//             content = (!content) ? result.content : content
            
//             Course.updateCourse([title, content, courseNumber, memberNumber], this)
//         },
//         // 코스 이미지 수정
//         function courseImageEditCheck(error, result) {
//             if (error) {
// 				throw new ErrorHandler(500, error)
//             }

//             console.log("4444 ::course = courseImageEditCheck()")
//             Course.selectCheckCourseImage([courseNumber], this)
//         },
//         function courseImageEditCheckResult(error, result) {
//             if (error) {
// 				throw new ErrorHandler(500, error)
//             }
            
//             console.log("5555 ::course = courseImageEditCheckResult()")
//             if (result[0] == null || result[0] == undefined) {
//                 response.status(404).send("Course Image does not exist")
//             } else {
//                 return result[0]
//             }
//         },
//         function updateCourseImage(error, result) {
//             if (error) {
// 				throw new ErrorHandler(500, error)
//             }
            
//             console.log("6666 ::course = updateCourseImage()")

//             originalImageName = (!setImageArray[0]) ? result.originalImageName : setImageArray[0]
//             savedImageName = (!setImageArray[1]) ? result.savedImageName : setImageArray[1]
//             mimetype = (!setImageArray[2]) ? result.mimetype : setImageArray[2]
//             imageSize = (!setImageArray[3]) ? result.imageSize : setImageArray[3]

//             Course.updateCourseImage([originalImageName, savedImageName, mimetype, imageSize, courseNumber, imageNumber], this)
//         },
//         // 코스의 장소 수정
//         function courseHasPlaceEditCheck(error, result) {
//             if (error) {
//                 throw new ErrorHandler(500, error)
//             }

//             console.log("1111111111111111111111111111111111111111111111111111111")
//             Course.selectCheckCourseHasPlace([courseNumber], this)
//         },
//         function courseHasPlaceEditCheckResult(error, result) {
//             if (error) {
// 				throw new ErrorHandler(500, error)
//             }

//             console.log("22222222222222222222222222222222222222222222222222222222")
//             console.log(result)
//             if (result[0] == null || result[0] == undefined) {
//                 response.status(404).send("Course Has Place does not exist")
//             } else {
//                 result.updateResult = true
//                 return result
//             }
//         },
//         function updateCourseTest(error, result) {
//             if (error) {
// 				throw new ErrorHandler(500, error)
//             }
//             console.log("4444444444444444444444444444444444444444444444")
//             console.log(result)
//             if (result.updateResult == true) {
// //------------------------------------------------------------------------
//                 placeNumber.forEach((item, index, array) => {
//                     placeNumber[index] = (!placeNumber[index]) ? result[index].placeNumber : placeNumber[index]
//                 })
// //-------------------------------------------------------------------------------
// //-------------------------------------------------------------------------------
//                 let coursePlaceNumber = new Array(result.length)
//                 result.forEach((item, index, array) => {
//                     coursePlaceNumber[index] = result[index].coursePlaceNumber
//                 })
// //-------------------------------------------------------------------------------

//                 for(i = 0; i < placeNumber.length; i++) {
//                     Course.updateCourseHasPlace([placeNumber[i], courseNumber, coursePlaceNumber[i]], function(error, results) {
//                     // Course.updateCourseHasPlace([placeNumber[i], courseNumber], function(error, results) {
//                         if (error) {
//                             return next(new ErrorHandler(500, error))
//                         }
//                         console.log("course update results: " + results)
//                     })
//                 }
                
//                 result.updateResult = true
//                 return result
//             }
//         },
//         function insertCourseHasPlace(error, result) {
//             if (error) {
// 				throw new ErrorHandler(500, error)
//             }
//             console.log("5555555555555555555555555555555555555")
//             console.log(result)
//             if (result.updateResult == true) {
//                 // result.length 결과값이 < placeNumber.length 이면 insert query
//                 if (result.length < placeNumber.length) {
//                     const placeNumberMap = result.map(result => `${result.placeNumber}`)
//                     const placeNumberMapArray = new Array()
//                     for(i = 0; i < placeNumber.length; i++) {
//                         if(placeNumber[i] != placeNumberMap[i]) {
//                             placeNumberMapArray.push(placeNumber[i])
//                         }
//                     }

//                     let setCourseHasPlaceNumberArray = new Array(placeNumberMapArray.length)
//                     for(j = 0; j < placeNumberMapArray.length; j++) {
//                         setCourseHasPlaceNumberArray[j] = new Array(1)
//                     }

//                     placeNumberMapArray.forEach((item, index, array) => {
//                         setCourseHasPlaceNumberArray[index][0] = item
//                         setCourseHasPlaceNumberArray[index].unshift(courseNumber)
//                     })

//                     Course.insertCourseHasPlace([setCourseHasPlaceNumberArray], function(error, results) {
//                         if (error) {
//                             return next(new ErrorHandler(500, error))
//                         }
//                         console.log("course update results: " + results)
//                     })
//                 }

//                 if (result.length > placeNumber.length) {
//                     var newCourseNumberArray = new Array()
//                     for (i = 0; i < result.length; i++) {
//                         if (result[i].placeNumber != placeNumber[i]) {
//                         // if (result[i].coursePlaceNumber != coursePlaceNumber[i]) {
//                             newCourseNumberArray.push(result[i].coursePlaceNumber)
//                         }
//                     }
//                     Course.deleteCourseHasPlace([newCourseNumberArray], function(error, results) {
//                         if (error) {
//                             return next(new ErrorHandler(500, error))
//                         }
//                         console.log("course update results: " + results)
//                     })
//                 }
                
//                 console.log("Update Success !!!")
//                 return response.status(200).send("Success !!!")
//             }
//         }
//     )
// }



// function deleteCourseHasPlace(error, result) {
        //     if (error) {
		// 		throw new ErrorHandler(500, error)
        //     }
            
        //     console.log("10 ::course = deleteCourseHasPlace()")
        //     console.log("66666666666666666666666666666666666666666666")
        //     // result.length 결과값이 > placeNumber.length 이면 delete query
        //     console.log(result)
        //     if (result.length > placeNumber.length) {
        //         var newCourseNumberArray = new Array()
        //         for (i = 0; i < result.length; i++) {
        //             if (result[i].placeNumber != placeNumber[i]) {
        //             // if (result[i].coursePlaceNumber != coursePlaceNumber[i]) {
        //                 newCourseNumberArray.push(result[i].coursePlaceNumber)
        //             }
        //         }

        //         console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& " + newCourseNumberArray)
        //         Course.deleteCourseHasPlace([newCourseNumberArray], function(error, results) {
        //             if (error) {
        //                 return next(new ErrorHandler(500, error))
        //             }
        //             console.log("course update results: " + results)
        //         })
        //     }
            
            
        //     console.log("Update Success !!!")
        //     return response.status(200).send("Success !!!")
        // }