const Wallet = require('../models/wallet')
const Transaction = require('../models/transaction')
const WalletTransaction = require('../models/walletTransaction')
const { BadRequestError } = require('../errors')

const response = async(req, res) =>{
try {
    const {transaction_id} = req.query
    const url = `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`;

    const response = await axios({
        url,
        method: "get",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `${process.env.SECRET_KEY}`,
        }
    })
    console.log(response.data.data)
    const {status, currency, customer, id, amount}  = response.data.data;
    //check if transaction id exists already
    const transaction = await Transaction.findOne({transactionId: id})
    if (transaction){
        throw new BadRequestError("Transaction id already exists.")
    }
    //check if user has a wallet
    const wallet = await validateUserWallet()
    await createWalletTransaction({status, currency, amount})
    
    await createTransaction({id, status, currency, amount, customer})
    await updateWallet(amount)

    res.status(200).json({
        response: "Wallet funded successfuly",
        data: wallet
    })
} catch (error){
    console.log(error);
    res.status(500).json({msg: "Something went wrong, try again later."})
}

}

const validateUserWallet = async ()=>{
    const userWallet = await Wallet.findOne({userId: req.user.userId})
    if (!userWallet){
        const wallet = await Wallet.create({userId: req.user.userId})
        return wallet
    }
    return userWallet
}

const createWalletTransaction = async ({status, currency, amount})=>{
    const walletTransaction = await WalletTransaction.create({amount, isInflow: true, currency, status, userId: req.user.userId})
    return walletTransaction
}

const createTransaction = async ({id, status, currency, amount, customer})=>{
    const transaction = await Transaction.create({userId: req.user.userId, 
        paymentStatus: status, paymentGateway: "flutterwave", amount, currency, orderId: customer.order_id,
        transactionId: id, name: customer.name, email: customer.email, phone: customer.phone_number
    })
    return transaction
}

const updateWallet = async (amount) =>{
    //remember do do {$inc}
    const wallet = await Wallet.findOneAndUpdate({userId: req.user.userId}, {$inc: {balance: amount}}, {new: true})
    return wallet
}

module.exports = response;