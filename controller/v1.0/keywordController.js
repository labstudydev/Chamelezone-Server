const Keyword = require('../../service/v1.0/keywordService')

exports.keywordReadAll = function(request, response, next) {
    Keyword.keywordReadAll(request, response, next)
}