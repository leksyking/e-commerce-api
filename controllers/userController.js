const User = require('../models/user')


const getAllUsers = async (req, res) => {
    const user = await User.find({role: 'user'}).select('-password')
    if(!user){
        throw new Error('Badrequest')
    }
    res.json({user})
}
const getSingleUser = async (req, res) => {
    const {id : UserId} = req.params
    const user = await User.find({_id: UserId}).select('-password')
    if(!user){
        throw new Error('Badrequest')
    }
    res.json({user})
}
const showCurrentUser = async (req, res) => {
    res.send("show current user")
}
const updateUser = async (req, res) => {
    res.send("update user")
}
const updateUserPassword = async (req, res) => {
    res.send("update password")
}

module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
}