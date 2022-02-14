const {isTokenValid} = require('../utils/jwt')

const authNiddleware = async (req, res, next) => {
    //check cookies
    let token = req.signedCookies.token
    const {userId, username, role} = isTokenValid({token})
    req.user = {userId, username, role}
    next()
}
const authorizePermission = () => {
    
}

module.exports = authNiddleware