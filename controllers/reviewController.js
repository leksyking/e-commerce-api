const Review = require('../models/review')
const {BadRequestError, notFoundError} = require('../errors')
const {StatusCodes} = require('http-status-codes')
const {} = require('../utils')

const createReview = async (req, res) => {
    req.body.user = req.user.userId
    if(!req.body.product){
        throw new BadRequestError('Please provide the product')
    }
    const review = await Review.create(req.body)
    res.status(StatusCodes.OK).json({review})
}
const getAllReviews = async (req, res) => {
    const review = await Review.find({})
    res.status(StatusCodes.OK).json({review})
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
    const  review = await Review.find({_id: reviewId})
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