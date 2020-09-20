const { ErrorHandler }      = require('../../costomModules/customError')
const Course                = require('../../service/v1.1/courseService.js')
const util                  = require('../../costomModules/util')
const isEmpty               = require('../../costomModules/valueCheck')

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

    Course.courseCreate([memberNumber, title, content, setImageArray, setPlaceNumberValues], function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }

        if (results == 400) { response.status(400).send("Create course duplicate") }
        else { response.status(200).send(results) }
    })
}

exports.courseReadAll = function(request, response, next) {
    Course.courseReadAll(request, function(error, results) {
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

    Course.courseReadOne([courseNumber, memberNumber], function(error, results) {
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

    Course.courseListUser([memberNumber], function(error, results) {
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

    Course.courseDelete([courseNumber, memberNumber], function(error, results) {
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

    Course.courseUpdate([courseNumber, imageNumber, memberNumber, title, content, placeNumber, savedImageName, setImageArray], function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }

        if (results == 200) { response.status(200).send('Course update success !!!') }
        if (results == 'INSERT SUCCESS') { response.status(404).send('Course insert-update success !!!') }
        if (results == 'DELETE SUCCESS') { response.status(200).send('Course delete-update success !!!') }
    })
}