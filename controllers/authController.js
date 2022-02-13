const User = require('../models/user')
const {attachCookiesToResponse} = require('../utils/jwt')

const register = async (req, res) => {
    const { email, name, password } = req.body
    const emailExists = await User.findOne({email})
    if(emailExists){
        console.log('email exists already');
    }
    const user = await  User.create(req.body)
    const userDatails = {userId: user._id, username: user.name}
    const token = attachCookiesToResponse({res, user:userDatails})
    res.status(200).json({user: {user: name, token:token}})
}

const login = async (req, res) => {
    res.status(200).send("Login user")
}

const logout = async (req, res) => {
    res.status(200).send("Logout user")
}

module.exports = {
    register,
    login,
    logout
}