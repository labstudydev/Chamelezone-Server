const { ErrorHandler }      = require('../../costomModules/customError')
const Keyword               = require('../../service/v1.1/keywordService')

exports.keywordReadAll = function(request, response, next) {
    Keyword.keywordReadAll(request, function(error, results) {
        if (error) {
            return next(new ErrorHandler(500, error))
        }

        response.status(200).send(results)
    })
}