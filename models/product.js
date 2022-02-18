const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    name : {
        type: String
    },
    price: {
        type: Number
    },
    desciption:{
        type: String
    },
    image: {
        type:  String
    },
    category: {
        type: String
    },
    company: {
        type: String
    },
    colors: {
        type: []
    },
    featured: {
        type: Boolean
    },
    freeShipping: {
        type: Boolean
    },
    inventory: {
        type: Number
    },
    averageRating: {
        type: Number
    },



},{timestamps: true})

const Product = mongoose.model('Product', ProductSchema)

module.exports =Product