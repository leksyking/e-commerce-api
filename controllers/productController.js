const Product = require('../models/product')
const {StatusCodes} = require('http-status-codes')
const { notFoundError, BadRequestError } = require('../errors')
const path = require('path')
 
const createProduct = async (req, res) => {
    req.body.user = req.user.userId
    const product = await Product.create(req.body)
    res.status(StatusCodes.CREATED).json({product})
}

const getAllProducts = async (req, res) => {
    const product = await Product.find({})
    res.status(StatusCodes.OK).json({product, nbHits: product.length})
}

const getSingleProduct = async (req, res) => {
    const {id: productId} = req.params
    const product = await Product.findById(productId).populate('reviews')
    if(!product){
        throw new notFoundError(`No product with id: ${productId}`)
    }
    res.status(StatusCodes.OK).json({product})
}

const updateProduct = async (req, res) => {
    const {id: productId} = req.params
    const product = await Product.findByIdAndUpdate(productId, req.body, {new: true, runValidators:true}) 
    if(!product){
        throw new notFoundError(`No product with id: ${productId}`)
    }
    res.status(StatusCodes.OK).json({product})
}

const deleteProduct = async (req, res) => {
    const {id: productId} = req.params
    const product = await Product.findByIdAndDelete(productId)
    res.status(StatusCodes.OK).json({msg: "Successful"})
}

const uploadImage = async (req, res) => {
    if(!req.files){
        throw new notFoundError("Please upload a file")
    }
    const productImage = req.files.image
    if(!productImage.mimetype.startsWith("image")){
        throw new BadRequestError("Please upoad an image")
    }
    const maxSize = 1024 * 1024
    if(productImage.size > maxSize){
        throw new BadRequestError("Size should not be more than 1MB")
    }
    const imagePath = path.join(__dirname, '../public/uploads/' + ` ${productImage.name}`)
    await productImage.mv(imagePath)
    res.status(200).json({image: `/uploads/${productImage.name}`})
}

module.exports = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage
}