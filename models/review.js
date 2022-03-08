const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    rating:{
        type: Number
    },
    title:{
        type: String
        
    }, 
    comment:{
        type: String
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: true
    }
}, {timestamps: true })

reviewSchema.index({product: 1, user: 1}, {unique: true})

reviewSchema.statics.calculateAverageRating = async function(productId){
    const result = await this.aggregate()
}
const Review = mongoose.model('Review', reviewSchema)

module.exports = Review