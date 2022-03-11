const Order = require('../models/order')
const Product = require('../models/product')
const { BadRequestError, notFoundError } = require('../errors')

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
    const total = tax + shippingFee + subtotal;


    res.status(200).json(req.body)
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