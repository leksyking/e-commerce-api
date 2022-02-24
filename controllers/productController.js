const Product = require('../models/product')
const {StatusCodes} = require('http-status-codes')
const { notFoundError } = require('../errors')
 
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
    const product = await Product.findById(productId)
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
    res.send('upload image')
}

module.exports = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage
}