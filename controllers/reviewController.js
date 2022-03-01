const Review = require('../models/review')
const {BadRequestError, notFoundError} = require('../errors')
const {StatusCodes} = require('http-status-codes')
const {checkPermissions} = require('../utils')
const Product = require('../models/product')

const createReview = async (req, res) => {
    const {product: productId} = req.body
    console.log(productId)
    const validProduct = await Product.findOne({_id : productId})
    if(!validProduct){
        throw new notFoundError(`User with id: ${productId} does not exist.`)
    }
    const validReview = await Review.findOne({product: productId, user: req.user.userId})
    if(validReview){
        throw new BadRequestError('You created a review already')
    }
    req.body.user = req.user.userId
    const review = await Review.create(req.body)
    res.status(StatusCodes.OK).json({review})
}
const getAllReviews = async (req, res) => {
    const reviews = await Review.find({})
    res.status(StatusCodes.OK).json({reviews})
}
const getSingleReview = async (req, res) => {
    const {id: reviewId} = req.params
    const review = await Review.findOne({_id: reviewId})
    if(!review){
        throw new notFoundError(`User with id: ${reviewId} does not exist.`)
    }
    res.status(StatusCodes.OK).json({review})
}
const updateReview = async (req, res) => {
    const {rating, title, comment} = req.body
    const {id: reviewId} = req.params
    const review = await Review.findOne({_id: reviewId})
    if(!review){
        throw new notFoundError(`User with id: ${reviewId} does not exist.`)
    }
    checkPermissions(req.user, review.user)
    review.rating = rating;
    review.title = title;
    review.comment = comment;
    await review.save();
    res.status(StatusCodes.OK).json({review})
}
const deleteReview = async (req, res) => {
    const {id: reviewId} = req.params
    const  review = await Review.findOne({_id: reviewId})
    if(!review){
        throw new notFoundError(`User with id: ${reviewId} does not exist.`)
    }
    checkPermissions(req.user, review.user)
    await review.remove()
    res.status(StatusCodes.OK).json({msg: "Success"})
}

module.exports = {
    createReview, 
    getAllReviews,
    getSingleReview,
    updateReview, 
    deleteReview
}