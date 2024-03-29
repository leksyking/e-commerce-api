const User = require('../models/user')
const Token = require('../models/token')
const {createTokenUser, attachCookiesToResponse, sendVerificationEmail, sendResetPasswordEmail, createHash} = require('../utils')
const { BadRequestError, unAuthenticatedError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const crypto = require('crypto')


const register = async (req, res) => {
    const { email, name, password } = req.body
    const emailExists = await User.findOne({email})
    if(emailExists){
       throw new BadRequestError("Email Exists Already")
    }
    //make first registered user an admin
    const checkFirstUser = (await User.countDocuments({})) === 0;
    const role = checkFirstUser ? 'admin' : 'user';

    const verificationToken = crypto.randomBytes(40).toString('hex');
    const user = await  User.create({email, name, password, role, verificationToken});
    const origin = "http://localhost:5000/api/v1";
    await sendVerificationEmail({name:user.name, email:user.email, verificationToken: user.verificationToken, origin});
    
    res.status(StatusCodes.CREATED).json({msg: 'Success, Please check your email to verify your account'})
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

    refreshToken = crypto.randomBytes(40).toString('hex');
    const userAgent = req.headers['user-agent'];
    const ip = req.ip;
    const userToken = {userAgent, ip, refreshToken, user: user._id}
    await Token.create(userToken)

    attachCookiesToResponse({res, user: tokenUser, refreshToken})
    res.status(StatusCodes.OK).json({user: tokenUser})
}

  


const logout = async (req, res) => {
    await Token.findOneAndDelete({user: req.user.userId})

    res.cookie('accessToken', 'logout',{
        httpOnly: true,
        expires: new Date(Date.now())
    })
    res.cookie('refreshToken', 'logout',{
        httpOnly: true,
        expires: new Date(Date.now())
    })
    
    res.status(StatusCodes.OK).json({msg: "User is logged out"})
}

const forgotPassword = async (req, res) => {
    const {email} = req.body;
    if(!email){
        throw new BadRequestError("Please provide a valid email")
    }
    const user = await User.findOne({email});

    if(user){
      const passwordToken = crypto.randomBytes(70).toString('hex')
      const origin = "http://localhost:5000/api/v1";
      await sendResetPasswordEmail({
          name: user.name,
          email: user.email,
          token: passwordToken,
          origin
      });
      const tenMinutes = 1000 * 60 * 10;
      const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

      user.passwordToken = createHash(passwordToken);
      user.passwordTokenExpirationDate = passwordTokenExpirationDate;
      await user.save()
    }
    res.status(StatusCodes.OK).json({msg: 'Please check your email for password reset link'})
}

const resetPassword = async (req, res) => {
    const {email, token, password} = req.body;
    if(!email || !token || !password){
        throw new BadRequestError('Please fill the required fields')
    }
    const user = await User.findOne({email})
    if(!user){
        throw new BadRequestError('Invalid email')
    }
    const currentDay = new Date()
    if(user.passwordToken === createHash(token) && user.passwordTokenExpirationDate > currentDay ){
        user.password = password;
        user.passwordToken = null;
        user.passwordTokenExpirationDate = null;
        await user.save()
    } else{
        throw new BadRequestError("Invalid Token")
    }
    res.status(StatusCodes.OK).json({msg: "Password reset successful"})
}

module.exports = {
    register,
    login,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword
}