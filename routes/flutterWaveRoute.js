const express = require('express')
const router = express.Router()

const response = require('../controllers/flutterWaveController')
const {authMiddleware} = require('../middlewares/authentication')

router.get('/response', authMiddleware, response)

module.exports = router;