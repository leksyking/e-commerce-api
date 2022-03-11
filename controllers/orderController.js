const Order = require('../models/order')
const Product = require('../models/product')
const { BadRequestError, notFoundError } = require('../errors');
const { StatusCodes } = require('http-status-codes');

const fakeStripeAPI = async ({amount, currency}) => {
    const client_secret = "sabbshkidasj";
    return {client_secret, amount} 
}

const createOrder = async (req, res) => {
    const {items: cartItems, tax, shippingFee} = req.body
    if(!cartItems || cartItems.length < 1){
        throw new BadRequestError('Provide cart items.')
    }
    if(!tax || !shippingFee){
        throw new BadRequestError('Please provide tax and shipping fee')
    }
    let orderItems = [];
    let subtotal = 0;

    for(const item of cartItems){
        const dbProduct = await Product.findOne({_id: item.product})
        if(!dbProduct){
            throw new notFoundError(`No product with id; ${item.product}`)
        }
        const { name, price, image, _id } = dbProduct
        const SingleOrderItem = { 
            amount: item.amount,
            name,
            price,
            image,
            product: _id
            }
        //add item to order
        orderItems = [...orderItems, SingleOrderItem];
            //calculate subtotal
        subtotal += item.amount * price;
    }
    //calculate total
    const total = tax + shippingFee + subtotal;

    //client secret
    const paymentIntent = await fakeStripeAPI({
        amount: total,
        currency: 'usd',
    })
    const order  = await Order.create({
        orderItems,
        total,
        subtotal,
        tax,
        shippingFee,
        clientSecret: paymentIntent.client_secret,
        user: req.user.userId,
    })

    res.status(StatusCodes.CREATED).json({order, clientSecret: order.clientSecret})
}
const getAllOrders = async (req, res) => {
    res.send('gett all orders')
}
const getSingleOrder = async (req, res) => {
    res.send('get single order')
}
const getCurrentUserOrders = async (req, res) => {
    res.send('get current user orders')
}

const updateOrder = async (req, res) => {
     res.send('update order')
}

module.exports = {
    getAllOrders,
    getSingleOrder,
    getCurrentUserOrders,
    createOrder,
    updateOrder
}

[
      {
        "tax": 399,
        "shippingFee": 499,
        "items": [
          {
            "name": "accent chair",
            "price": 2599,
            "image": "https://dl.airtable.com/.attachmentThumbnails/e8bc3791196535af65f40e36993b9e1f/438bd160",
            "amount": 34,
            "product": "6126ad3424d2bd09165a68c8"
          }
        ]
      },
      {
        "tax": 499,
        "shippingFee": 799,
        "items": [
          {
            "name": "bed",
            "price": 2699,
            "image": "https://dl.airtable.com/.attachmentThumbnails/e8bc3791196535af65f40e36993b9e1f/438bd160",
            "amount": 3,
            "product": "6126ad3424d2bd09165a68c7"
          },
          {
            "name": "chair",
            "price": 2999,
            "image": "https://dl.airtable.com/.attachmentThumbnails/e8bc3791196535af65f40e36993b9e1f/438bd160",
            "amount": 2,
            "product": "6126ad3424d2bd09165a68c4"
          }
        ]
      }
    ]
    