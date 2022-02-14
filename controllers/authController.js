const User = require('../models/user')
const {attachCookiesToResponse} = require('../utils/jwt')
const createTokenUser = require('../utils/createTokenuser')

const register = async (req, res) => {
    const { email, name, password } = req.body
    const emailExists = await User.findOne({email})
    if(emailExists){
        console.log('email exists already');
    }
    //make first registered user an admin
    //i will be back
    const checkFirstUser = (await User.countDocuments()) === 0
    
    const role = checkFirstUser ? 'admin' : 'user'

    const user = await  User.create({email, name, password, role})
    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({res, user: tokenUser})
    res.status(200).json({user: {user: tokenUser }})
}

const login = async (req, res) => {
    const {email, password} = req.body
    if(!email || !password){
        console.log("Ple7ase enter your email and password");
    }
    const user = await User.findOne({email})
    if(!user){
        console.log("Invalid email");
    }

    const isPassword = await user.comparePassword(password)
    console.log(isPassword);
    if(!isPassword){
     throw new Error("Invalid credentials");
    }
    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({res, user: tokenUser})
    res.status(200).json({user: tokenUser})
}

const logout = async (req, res) => {
    res.cookie('token', 'logout',{
        httpOnly: true,
        expires: new Date(Date.now() + 1000)
    } )
    res.status(200).json({msg: "User is logged out"})
}

module.exports = {
    register,
    login,
    logout
}