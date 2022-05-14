const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    transactionId:{
        type: Number,
        trim: true
    },
    name:{
        type: String,
        required: [true, 'name is required'],
        trim: true
    },
    email:{
        type: String,
        required: [true, 'email is required'],
        trim: true
    },
    phone:{
        type: Number,
    },
    amount:{
        type: Number,
        required: [true, 'amount is required']
    },
    currency:{
        type: String,
        required: [true, 'currency is required'],
        enum: ['NGN', 'USD', 'EUR', 'GBP']
    },
    paymentStatus:{
        type: String,
        enum: ['pending', 'successful', 'failed'],
        default: 'pending'
    },
    paymentGateway:{
        type: String,
        required: [true, 'Payment gateway is required'],
        enum: ['flutterwave']
    }
}, {timestamps: true})

module.exports = mongoose.model('Transaction', transactionSchema)