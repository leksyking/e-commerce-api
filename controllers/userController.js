const User = require('../models/user')
const {StatusCodes} = require('http-status-codes')
const { notFoundError, BadRequestError } = require('../errors')

const getAllUsers = async (req, res) => {
    const user = await User.find({role: 'user'}).select('-password')
    res.status(StatusCodes.OK).json({user})
}
const getSingleUser = async (req, res) => {
    const {id : UserId} = req.params
    const user = await User.find({_id: UserId}).select('-password')
    if(!user){
        throw new notFoundError("User does not exist")
    }
    res.status(StatusCodes.OK).json({user})
}
const showCurrentUser = async (req, res) => {
    res.status(StatusCodes.OK).json({user: req.user})
}
const updateUser = async (req, res) => {

    res.status(StatusCodes.OK).send("update user")
}
const updateUserPassword = async (req, res) => {
    const {oldpassword, newpassword } = req.body
    if(!oldpassword || !newpassword){
        throw new BadRequestError("Enter your passwords")
    }
    const user = await User.findOne
    res.status(StatusCodes.OK).send("update password")
}

module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
}