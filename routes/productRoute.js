const express = require('express')
const router = express.Router()
const {createProduct, getAllProducts, getSingleProduct, updateProduct, deleteProduct, uploadImage} = require('../controllers/productController')

router.route('/create').post(createProduct)
router.route('/').get(getAllProducts)
router.route('/:id').get(getSingleProduct)
router.route('/update').patch(updateProduct)
router.route('/delete').delete(deleteProduct)
router.route('/upload').post(uploadImage)


module.exports = router