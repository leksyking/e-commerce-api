const express = require('express')
const router  = express.Router()
const {createReview, getAllReviews, getSingleReview, updateReview, deleteReview} = require('../controllers/reviewController')
const {authMiddleware} = require('../middlewares/authentication')

router.route('/').get(getAllReviews).post(authMiddleware, createReview)

router.route('/:id').get(getSingleReview).patch(authMiddleware, updateReview).delete(authMiddleware, deleteReview)

module.exports = router