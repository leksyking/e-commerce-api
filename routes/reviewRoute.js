const express = require('express')
const router  = express.Router()
const {createReview, getAllReviews, getSingleReview, updateReview, deleteReview} = require('../controllers/reviewController')


router.route('/').get().post()

router.route('/:id').get().patch().delete()

module.exports = router