class ErrorHandler extends Error {
    constructor(statusCode, message) {
        super()
        this.statusCode = statusCode;
        this.message = message;
    }
}

const handleError = (error, response) => {
    const { statusCode, message } = error
    response.status(statusCode).json({
        status: "error",
        statusCode,
        message
    })
}

class NullCheckErrorHandler extends Error {
    constructor(statusCode, key) {
        super()
        this.statusCode = statusCode;
        this.key = key;
    }
}

const nullCheckHandleError = (error, response) => {
    const { statusCode, key } = error
    response.status(statusCode).json({
        status: "null error",
        statusCode,
        key
    })
}

module.exports = {
    ErrorHandler, handleError, NullCheckErrorHandler, nullCheckHandleError
}