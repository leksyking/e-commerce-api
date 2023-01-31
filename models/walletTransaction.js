const mongoose = require('mongoose')

const walletTransactionSchema = new mongoose.Schema({
    amount:{
        type: Number,
        default: 0
    },
    userId:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isInflow: Boolean,
    paymentMethod:{ 
        type: String,
        default: "flutterwave"
    },
    currency:{
        type: String,
        required: [true, 'currency is required'],
        enum:{
            values: ['NGN', 'USD', 'EUR', 'GBP'],
            message: '{VALUE} is not supported.'
        }
    },
    status:{
        type: String,
        required: [true, 'Payment status is required'],
        enum: ['pending', 'successful', 'failed']
    }
}, {timestamps: true})

module.exports = mongoose.model("WalletTransaction", walletTransactionSchema)