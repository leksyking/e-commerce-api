const createTokenUser = require('../utils/createTokenuser')
const {isTokenValid, attachCookiesToResponse} = require('../utils/jwt')
const checkPermissions = require('../utils/checkPermissions')
const sendResetPasswordEmail = require('./sendResetpasswordEmail')
const sendVerificationEmail = require('./sendVericationEmail')
const createHash= require('./createHash')

module.exports = {
    createTokenUser,
    isTokenValid,
    attachCookiesToResponse,
    checkPermissions,
    sendVerificationEmail,
    createHash,
    sendResetPasswordEmail
}