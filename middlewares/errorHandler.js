const errorHandlerMiddleware = (err, req, res, next) => {
      return res.status(err.statusCode).json({err: err.message})
}

module.exports = errorHandlerMiddleware