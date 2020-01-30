/* ==================== START modules ==================== */

const { ErrorHandler }      = require('../costomModules/customError')
const isEmpty               = require('../costomModules/valueCheck')
const Review                = require('../dao/reviewDao.js');

/* ==================== END modules ==================== */

exports.reviewCreate = function(request, response, next) {
    const setValues = {
        content
    } = request.body

    isEmpty('content', content)
    console.log(content)

    Review.insertReview([content], function(error, results) {
        console.log("여기들어와?")
        if (error) {
            console.log(__filename + ", Review.insertReview() error status code 500 !!!")
            return next(new ErrorHandler(500, error))
        }
        response.status(200).send(results)
    })
}