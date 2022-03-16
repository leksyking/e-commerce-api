const User = require('../models/user')
const {createTokenUser ,attachCookiesToResponse} = require('../utils')
const { BadRequestError, unAuthenticatedError } = require('../errors')
const { StatusCodes } = require('http-status-codes')

const register = async (req, res) => {
    const { email, name, password } = req.body
    const emailExists = await User.findOne({email})
    if(emailExists){
       throw new BadRequestError("Email Exists Already")
    }
    //make first registered user an admin
    const checkFirstUser = (await User.countDocuments()) === 0
    const role = checkFirstUser ? 'admin' : 'user';

    const verificationToken = 'fictionalized token';
    const user = await  User.create({email, name, password, role, verificationToken})
    res.status(StatusCodes.CREATED).json({msg: 'Success', verificationToken})
}

const login = async (req, res) => {
    const {email, password} = req.body
    if(!email || !password){
        throw new BadRequestError("Please provide an email and password")
    }
    const user = await User.findOne({email})
    if(!user){
        throw new unAuthenticatedError("Invalid email")
    }
    const isPassword = await user.comparePassword(password)
    if(!isPassword){
     throw new unAuthenticatedError("Invalid Password");
    }
    if(!user.isVerified){
        throw new unAuthenticatedError("Please verify your email")
    }
    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({res, user: tokenUser})
    res.status(StatusCodes.OK).json({user: tokenUser})
}

const logout = async (req, res) => {
    res.cookie('token', 'logout',{
        httpOnly: true,
        expires: new Date(Date.now() + 1000)
    })
    res.status(StatusCodes.OK).json({msg: "User is logged out"})
}

module.exports = {
    register,
    login,
    logout
}