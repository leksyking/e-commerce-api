const createTokenUser = require('../utils/createTokenuser')
const {isTokenValid, attachCookiesToResponse} = require('../utils/jwt')
const checkPermissions = require('../utils/checkPermissions')
const sendVerificationEmail = require('./sendVericationEmail')

module.exports = {
    createTokenUser,
    isTokenValid,
    attachCookiesToResponse,
    checkPermissions,
    sendVerificationEmail
}