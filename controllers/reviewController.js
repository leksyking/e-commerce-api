const Review = require('../models/review')


const createReview = async (req, res) => {
    req.body.user = req.user.userId
    //get product id
    const review = await Review.create()
    res.send('Create a review')
}
const getAllReviews = async (req, res) => {
    res.send('Get all reviews')
}
const getSingleReview = async (req, res) => {
    res.send('Get a single review')
}
const updateReview = async (req, res) => {
    res.send('Update review')
}
const deleteReview = async (req, res) => {
    res.send('Delete a review')
}

module.exports = {
    createReview, 
    getAllReviews,
    getSingleReview,
    updateReview, 
    deleteReview
}