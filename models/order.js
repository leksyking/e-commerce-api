const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    tax: {
        type: Number
    },
    shippingFee: {
        type: Number
    },
    subtotal: {
        type: Number
    },
    total: {
        type: Number
    },
    orderItems: [],
    status: {
        type: String
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    clientSecret: {
        type: String
    },
    paymentId: {
        type: String
    }
}, {timestamps: true})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order