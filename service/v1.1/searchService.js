const { ErrorHandler }      = require('../../costomModules/customError')
const Search                = require('../../dao/v1.1/searchDao.js')

exports.searchByPlaceName = function([name], response, next) {
    try {
        Search.selectByPlaceName(name, function(error, results) {
            if (error) { return response(error, null) }
            
            if(results.length == 0) {
                response(null, 404)
            } else {
                response(null, results)
            }
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

exports.searchByAreaName = function([name], response, next) {
    try {
        Search.selectByAreaName(name, function(error, results) {
            if (error) {
                return next(new ErrorHandler(500, error))
            }
            
            if(results.length == 0) {
                response(null, 404)
            } else {
                response(null, results)
            }
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}
    

exports.searchByKeywordName = function([name], response, next) {
    try {
        Search.selectByKeywordName(name, function(error, results) {
            if (error) {
                return next(new ErrorHandler(500, error))
            }
    
            if(results.length == 0) {
                response(null, 404)
            } else {
                response(null, results)
            }
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}