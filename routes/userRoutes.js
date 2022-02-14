const express = require('express')
const router = express.Router()
const {getAllUsers, getSingleUser, showCurrentUser, updateUser, updateUserPassword } = require('../controllers/userController')
const authNiddleware = require('../middlewares/authentication')

router.route('/').get(authNiddleware, getAllUsers)
router.route('/:id').get(getSingleUser)

module.exports = router