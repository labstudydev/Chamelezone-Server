const Keyword = require('../service/keywordService')

exports.keyword_readAll = function(request, response, next) {
    Keyword.keyword_readAll(request, response, next)
}