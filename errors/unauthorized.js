const { StatusCodes } = require('http-status-codes')
const CustomApiError = require('../errors/custom')

class unAuthorizedError extends CustomApiError{
    constructor(message){
        super(message)
        this.statusCode = StatusCodes.FORBIDDEN
    }
}

module.exports = unAuthorizedError