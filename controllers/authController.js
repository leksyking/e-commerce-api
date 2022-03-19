const User = require('../models/user')
const Token = require('../models/token')
const {createTokenUser ,attachCookiesToResponse, sendVerificationEmail} = require('../utils')
const { BadRequestError, unAuthenticatedError } = require('../errors')
const { StatusCodes } = require('http-status-codes')

const register = async (req, res) => {
    const { email, name, password } = req.body
    const emailExists = await User.findOne({email})
    if(emailExists){
       throw new BadRequestError("Email Exists Already")
    }
    //make first registered user an admin
    const checkFirstUser = (await User.countDocuments({})) === 0;
    const role = checkFirstUser ? 'admin' : 'user';

    const verificationToken = 'fictionalized token';
    const user = await  User.create({email, name, password, role, verificationToken});

    const origin = "http://localhost:5000/api/v1";
    await sendVerificationEmail({name:user.name, email:user.email, verificationToken: user.verificationToken, origin});
    
    res.status(StatusCodes.CREATED).json({msg: 'Success, Please check your email to verify your account', verificationToken})
}

const verifyEmail = async (req, res) => {
    const {verificationToken, email} = req.body
    const user = await User.findOne({email})
    if(!user){
        throw new  unAuthenticatedError('Invalid Email')
    }
    if(verificationToken !== user.verificationToken){
        throw new  unAuthenticatedError('Invalid Token')
    }
    user.isVerified = true;
    user.verified = Date.now();
    user.verificationToken = '';
    await user.save();

    res.status(StatusCodes.OK).json({msg: 'Email verified'})
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

    //create fresh token
    let refreshToken = '';
    //check for existing token
    const existingToken = await Token.findOne({user: user._id})

    if(existingToken){
        const {isValid} = existingToken;
        if(!isValid){
            throw new unAuthenticatedError("Invalid details")
        }
        refreshToken = existingToken.refreshToken;
        attachCookiesToResponse({res, user: tokenUser, refreshToken})
        res.status(StatusCodes.OK).json({user: tokenUser})
        return;
    }
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
    logout,
    verifyEmail
}