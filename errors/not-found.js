const { StatusCodes } = require('http-status-codes')
const CustomApiError = require('../errors/custom')

class notFoundError extends CustomApiError{
    constructor(message){
        super(message)
        this.statusCodes = StatusCodes.NOT_FOUND
        }
}

module.exports = notFoundError