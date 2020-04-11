const Keyword = require('../service/keywordService')

exports.keywordReadAll = function(request, response, next) {
    Keyword.keywordReadAll(request, response, next)
}