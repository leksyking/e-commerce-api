const { StatusCodes} = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) => {
      let customError = {
            status:  err.statusCode ||StatusCodes.INTERNAL_SERVER_ERROR,
            message: err.message || 'Oops!, Something went wrong'
      }
      if(err.name === 'CastError'){
            customError.status = 404
            customError.message = `No user with id: ${err.value}`
      }
      console.log(err);
      return res.status(customError.status).json({err:err})
}
//cast error - wrong id
//110001
module.exports = errorHandlerMiddleware