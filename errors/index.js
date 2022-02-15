const CustomApiError = require('../errors/custom')
const notFoundError = require('../errors/not-found')
const BadRequestError = require('../errors/badRequest')
const unAuthenticatedError = require('../errors/unauthenticated')
const unAuthorizedError = require('../errors/unauthorized')

module.exports = {
    CustomApiError,
    notFoundError,
    BadRequestError,
    unAuthenticatedError,
    unAuthorizedError
}