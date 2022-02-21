const express = require('express')
const router = express.Router()
const {createProduct, getAllProducts, getSingleProduct, updateProduct, deleteProduct, uploadImage} = require('../controllers/productController')
const {authMiddleware, authorizePermission} = require('../middlewares/authentication')


router.route('/').get(getAllProducts)
.post(authMiddleware, authorizePermission('admin'), createProduct)

router.route('/:id').get(getSingleProduct)
.patch(authMiddleware, authorizePermission('admin'), updateProduct)
.delete(authMiddleware, authorizePermission('admin'), deleteProduct)

router.route('/uploadImage').post(authMiddleware, authorizePermission('admin'), uploadImage)


module.exports = router