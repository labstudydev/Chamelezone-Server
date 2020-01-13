module.exports = errorHandler = (err, req, res, next) => {
    console.log(err.statusCode)
    console.log(err.message)
    next(err) // res.status(err.status).send(err.message)
}
