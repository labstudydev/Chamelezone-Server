module.exports = errorHandler = (err, req, res, next) => {
    res.status(err.status).send(err.message)
}