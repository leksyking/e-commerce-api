const { unAuthenticatedError, unAuthorizedError } = require('../errors')
const {isTokenValid, attachCookiesToResponse} = require('../utils')
const Token = require('../models/token');



const authMiddleware = async (req, res, next) => {
    //check cookies
    const {accessToken, refreshToken} = req.signedCookies
    try {
    if(accessToken){
        const payload = isTokenValid({accessToken})
        req.user = payload.user;
        return next();
    }
    const payload = isTokenValid({refreshToken})

    const existingToken = await Token.findOne({
        user: payload.user.userId, 
        refreshToken: payload.refreshToken
    });
    if(!existingToken || !existingToken?.isValid){
        throw new unAuthenticatedError("Authentication failed")
    }
    attachCookiesToResponse({res, user: payload.user, refreshToken: existingToken.refreshToken })
    req.user = payload.user;
    next();
    } catch (error) {
        throw new unAuthenticatedError("Authentication failed")
    }
}

const authorizePermission = (...roles) => {
    return (req, res, next) =>{
        if(!roles.includes(req.user.role)){
            throw new unAuthorizedError("You are not authorized to access this route")
        }
        next()
    }
}

module.exports = {
    authMiddleware,
    authorizePermission
}