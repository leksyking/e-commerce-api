const { unAuthenticatedError, unAuthorizedError } = require('../errors')
const {isTokenValid} = require('../utils/jwt')

const authMiddleware = async (req, res, next) => {
    //check cookies
    let token = req.signedCookies.token
    if(!token){
        throw new unAuthenticatedError("Authentication failed")
    }
    try {
        const {userId, username, role} = isTokenValid({token})
        req.user = {userId, username, role}
        next()
    } catch (error) {
        throw new unAuthenticatedError("Authentication failed")
    }
}
const authorizePermission = (roles) => {
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