const jwt = require('jsonwebtoken')

const createJWT = ({payload}) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME
    })
    return token
}
const isTokenValid = ({token}) => jwt.verify(token, process.env.JWT_SECRET)

const attachCookiesToResponse = ({res, user}) => {
    return createJWT({payload: user})
}



module.exports = {
    isTokenValid,
     attachCookiesToResponse
}