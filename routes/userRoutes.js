const express = require('express')
const { NETWORK_AUTHENTICATION_REQUIRED } = require('http-status-codes')
const router = express.Router()
const {getAllUsers, getSingleUser, showCurrentUser, updateUser, updateUserPassword } = require('../controllers/userController')
const {authMiddleware, authorizePermission} = require('../middlewares/authentication')

router.route('/').get(authMiddleware, authorizePermission('admin'), getAllUsers)
router.route('/:id').get(authMiddleware, getSingleUser)

module.exports = router