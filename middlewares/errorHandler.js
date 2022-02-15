const { StatusCodes} = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) => {
      let customError = {
            status:  err.statusCode ||StatusCodes.INTERNAL_SERVER_ERROR,
            message: err.message || 'Oops!, Something went wrong'
      }
      // if(){

      // }
      console.log(err);
      return res.status(customError.status).json({err: err.message})
}
//cast error - wrong id
//110001
module.exports = errorHandlerMiddleware