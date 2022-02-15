const { StatusCodes } = require('http-status-codes')
const CustomApiError = require('../errors/custom')

class unAuthenticatedError extends CustomApiError{
    constructor(message){
        super(message)
        this.statusCode = StatusCodes.UNAUTHORIZED
    }
}

module.exports = unAuthenticatedError