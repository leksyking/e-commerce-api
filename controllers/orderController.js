const Order = require('../models/order')
const Product = require('../models/product')

const { BadRequestError, notFoundError } = require('../errors');
const { StatusCodes } = require('http-status-codes');
const { checkPermissions } = require('../utils');

const fakeStripeAPI = async ({amount, currency}) => {
    const client_secret = "sabbshkidasj";
    return {client_secret, amount} 
}

const createOrder = async (req, res) => {
    const {items: cartItems, tax, shippingFee} = req.body;
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
    const order = await Order.find({})
    res.status(StatusCodes.OK).json({order})
}
const getSingleOrder = async (req, res) => {
    const {id: orderId} = req.params
    const order = await Order.findOne({_id: orderId})
    if(!order){
      throw new notFoundError(`No order with id: ${orderId}`)
    }
    checkPermissions(req.user, order.user)
    res.status(StatusCodes.OK).json({order})
}
const getCurrentUserOrders = async (req, res) => {
    const order = await Order.find({user: req.user.userId})
    if(!order){
      throw new notFoundError(`No orders created by ${order.user}`)
    }
    res.status(StatusCodes.OK).json({orders: order, nbHits: order.length})
}

const updateOrder = async (req, res) => {
    const {id: orderId} = req.params
    const{paymentIntent} = req.body
    const order = await Order.findOne({_id: orderId})
    if(!order){
      throw new notFoundError(`No order with id: ${orderId}`)
    }
    checkPermissions(req.user, order.user)
    order.paymentIntent = paymentIntent;
    order.status = 'paid'
    await order.save()
    res.status(StatusCodes.OK).json({order})
}

module.exports = {
    getAllOrders,
    getSingleOrder,
    getCurrentUserOrders,
    createOrder,
    updateOrder
}
