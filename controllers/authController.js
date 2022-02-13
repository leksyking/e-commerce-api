const User = require('../models/user')

const register = async (req, res) => {
    const { email } = req.body
    const emailExists = await User.findOne({email})
    if(emailExists){
        console.log('email exists already');
    }
    const user = await  User.create(req.body)

    res.status(200).json({user})
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