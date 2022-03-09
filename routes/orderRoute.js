const express = require('express')
const router = express.Router()

const {getAllOrders, getCurrentUserOrders, getSingleOrder, createOrder, updateOrder} = require('../controllers/orderController')
const {authMiddleware, authorizePermission} = require('../middlewares/authentication')

router.route('/').get(authMiddleware, authorizePermission("admin"), getAllOrders).post(authMiddleware, createOrder)
router.route('/showAllMyOrders').get(authMiddleware, getCurrentUserOrders)

router.route('/:id').get(authMiddleware, getSingleOrder).patch(authMiddleware, updateOrder)



module.exports = router