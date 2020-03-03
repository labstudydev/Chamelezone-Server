/* ==================== START modules ==================== */

const { ErrorHandler }      = require('../costomModules/customError')
const isEmpty               = require('../costomModules/valueCheck')
const Search                = require('../dao/searchDao.js')
const util                  = require('../costomModules/util')

/* ==================== END modules ==================== */

exports.searchByPlaceName = function(request, response, next) {
    let name = request.params.name
    isEmpty('name', name)

    Search.selectByPlaceName(name, function(error, results) {
        if (error) {
            console.log(__filename + ", Search.searchByPlaceName() error status code 500 !!!")
            return next(new ErrorHandler(500, error))
        }

        if(results.length == 0 || results.length == undefined) {
            response.status(404).send("No Results Found")
        } else {
            util.resultStringToArray(results, ['keywordName', 'imageNumber', 'savedImageName'])
            response.status(200).send(results)
        } 
    })
}

exports.searchByAreaName = function(request, response, next) {
    let name = request.params.name
    isEmpty('name', name)

    Search.selectByAreaName(name, function(error, results) {
        if (error) {
            console.log(__filename + ", Search.searchByAreaName() error status code 500 !!!")
            return next(new ErrorHandler(500, error))
        }
        
        if(results.length == 0 || results.length == undefined) {
            response.status(404).send("No Results Found")
        } else {
            util.resultStringToArray(results, ['keywordName', 'imageNumber', 'savedImageName'])
            response.status(200).send(results)
        } 
    })
}

exports.searchByKeywordName = function(request, response, next) {
    let name = request.params.name
    isEmpty('name', name)

    Search.selectByKeywordName(name, function(error, results) {
        if (error) {
            console.log(__filename + ", Search.searchByKeywordName() error status code 500 !!!")
            return next(new ErrorHandler(500, error))
        }

        if(results.length == 0 || results.length == undefined) {
            response.status(404).send("No Results Found")
        } else {
            util.resultStringToArray(results, ['keywordName', 'imageNumber', 'savedImageName'])
            response.status(200).send(results)
        } 
    })
}
