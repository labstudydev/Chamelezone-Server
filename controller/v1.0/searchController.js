const Search = require('../../service/v1.0/searchService')

exports.searchByPlaceName = function(request, response, next) {
    Search.searchByPlaceName(request, response, next)
}

exports.searchByAreaName = function(request, response, next) {
    Search.searchByAreaName(request, response, next)
}

exports.searchByKeywordName = function(request, response, next) {
    Search.searchByKeywordName(request, response, next)
}