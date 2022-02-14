const errorHandlerMiddleware = (err, req, res, next) => {
      console.log(err);
      return res.status(500).json({err})
}
//cast error - wrong id
//110001
module.exports = errorHandlerMiddleware