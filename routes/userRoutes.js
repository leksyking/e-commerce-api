const express = require('express')
const router = express.Router()
const {getAllUsers, getSingleUser, showCurrentUser, updateUser, updateUserPassword } = require('../controllers/userController')
const {authMiddleware, authorizePermission} = require('../middlewares/authentication')

router.route('/').get(authMiddleware, authorizePermission('admin'), getAllUsers)

router.route('/showUser').get(authMiddleware, showCurrentUser);
router.route('/updatePassword').patch(authMiddleware, updateUserPassword)
router.route('/:id').get(authMiddleware, getSingleUser)
module.exports = router