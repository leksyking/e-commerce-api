const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    name : {
        type: String,
        trim: true,
        required: [true, "Please provide product's name"],
        maxlength: [100, "Name can not be more than 100 characters."]
    },
    price: {
        type: Number,
        required: [true, "Please provide product's price."],
        default: 0
    },
    description:{
        type: String,
        required: [true, "Please provide product's description"],
        maxlength: [1000, "Description can not be more than 1000 characters."]
    },
    image: {
        type:  String,
        default: '/uploads/examples.jpg'
    },
    category: {
        type: String,
        required: [true, "Please provide product's category"],
        enum: ['home', 'office']
    },
    company: {
        type: String,
        required: [true, "Please provide product's Company."],
        enum: {
            values: ['LoniShege', 'Leksyking', 'CodeGenius', 'Bovage'],
            message: '{VALUE} is not supported'
        }
    },
    colors: {
        type: [String],
        default: ['#000'],
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    freeShipping: {
        type: Boolean,
        default: false
    },
    inventory: {
        type: Number,
        required: true,
        default: 15
    },
    averageRating: {
        type: Number,
        default: 0
    },
    numOfReviews : {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
},
{timestamps: true, 
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true } 
})
ProductSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product',
    justOne: false
})
// ProductSchema.pre('remove', async function(){
//     await this.model('Review').deleteMany({prouct: this._id})
  
// })
const Product = mongoose.model('Product', ProductSchema)

module.exports =Product