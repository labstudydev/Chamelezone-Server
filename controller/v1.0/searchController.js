const { ErrorHandler }      = require('../../costomModules/customError')
const isEmpty               = require('../../costomModules/valueCheck')
const util                  = require('../../costomModules/util')
const Search                = require('../../service/v1.0/searchService')

exports.searchByPlaceName = function(request, response, next) {
    let name = request.params.name
    const nullValueCheckObject = {
        name
    }
    isEmpty(nullValueCheckObject)

    Search.searchByPlaceName([name], function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }

        if(results == 404) {
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

    Search.searchByAreaName([name], function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }
        
        if(results == 404) {
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

    Search.searchByKeywordName([name], function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }
        
        if(results.length == 0) {
            response.status(404).send("No Results Found")
        } else {
            util.resultStringToArray(results, ['keywordName', 'imageNumber', 'savedImageName'])
            response.status(200).send(results)
        }
    })
}