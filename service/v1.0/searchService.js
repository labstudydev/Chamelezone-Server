const { ErrorHandler }      = require('../../costomModules/customError')
const isEmpty               = require('../../costomModules/valueCheck')
const Search                = require('../../dao/v1.0/searchDao.js')
const util                  = require('../../costomModules/util')

exports.searchByPlaceName = function(request, response, next) {
    let name = request.params.name
    const nullValueCheckObject = {
        name
    }
    isEmpty(nullValueCheckObject)

    Search.selectByPlaceName(name, function(error, results) {
        if (error) {
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
    const nullValueCheckObject = {
        name
    }
    isEmpty(nullValueCheckObject)

    Search.selectByAreaName(name, function(error, results) {
        if (error) {
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
    const nullValueCheckObject = {
        name
    }
    isEmpty(nullValueCheckObject)

    Search.selectByKeywordName(name, function(error, results) {
        if (error) {
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