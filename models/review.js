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
    const result = await this.aggregate([
        {$match: {product: productId} },
        {$group:{
            _id: null,
            averageRating:{$avg: '$rating'} ,
            noOfReviews: {$sum: 1}
        }}
    ])
    try {
        await this.model('Product').findOneandUpdate(
            {_id: productId},
            {
                averageRating: Math.ceil(result[0]?.averageRating || 0),
                numOfReviews: result[0]?.numOfReviews || 0,
              })
    } catch (error) {
        console.log(error);
    }
}
reviewSchema.post('save', async function(){
    await this.constructor.calculateAverageRating(this.product)
})
reviewSchema.post('remove', async function(){
    await this.constructor.calculateAverageRating(this.product)
})

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review