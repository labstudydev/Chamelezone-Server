/* ==================== START modules ==================== */

const Search = require('../service/searchService');

/* ==================== END modules ==================== */

exports.searchByName = function(request, response, next) {
    Search.searchByName(request, response, next)
}