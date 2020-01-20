/* ==================== START modules ==================== */

const Keyword = require('../service/keywordService');

/* ==================== END modules ==================== */

exports.keyword_readAll = function(request, response, next) {
    Keyword.keyword_readAll(request, response, next)
}