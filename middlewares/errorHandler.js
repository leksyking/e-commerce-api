const errorHandlerMiddleware = (err, req, res) => {
    return res.status(err.statusCode).send(err.message)
}

module.exports = errorHandlerMiddleware