/* ==================== START modules ==================== */

const { ErrorHandler }      = require('../costomModules/customError')
const Course                = require('../dao/courseDao.js')
const isEmpty               = require('../costomModules/valueCheck')

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

        /////////////////////////////////////////////////////////////////
        // const json_list = results.reduce((pre, cur) => {
        //     if(!pre[pre.courseNumber]) {
        //         pre[pre.courseNumber] = [{ placeNumber: cur.placeNumber, place_name: cur.place_name }]
        //     }
            
        //     pre[cur.courseNumber].push({ placeNumber: cur.placeNumber, place_name: cur.place_name })
                        
        //     return pre
        // }, )
        // console.log("############### + ", json_list)

        // const json_test = JSON.parse(results)
        // console.log("@@@@@@@@@@", json_test)

        // const test = Object.entries(results)
        // console.log("############", test)

        // const json_list = Object.entries(results).forEach((value) => {
        //     console.log(value[1])
        //     return { courseNumber: value.courseNumber}
        // })
        // console.log("tjson_listst : " , json_list)

        // let new_result = {}
        // Object.keys(results).forEach(function(key) {
        //     var row = results[key];
        //     console.log(row.title)
        // });

        response.status(200).send(results)
        
        /////////////////////////////////////////////////////////////////

        // response.status(200).send(results)
    })
}


        // /////////////////////////////////////////////////////////////////
        // // const list = results.reduce((pre, cur) => {
        // //     if(!pre[cur.placeNumber]) {
        // //         pre[cur.placeNumber] = [{ keywordNumber: cur.keywordNumber, name: cur.name }]
        // //     }
        // //     else {
        // //         pre[cur.placeNumber].push({ keywordNumber: cur.keywordNumber, name: cur.name })
        // //     }
        // //     return pre
        // // }, )
        // // console.log(list)

        // const json_list = Object.entries(results).map((key, value) => {
        //     // console.log('key', key)
        //     return { placeNumber: key[0], keywordList: key[1] }
        // })
        

        // response.status(200).send(json_list)