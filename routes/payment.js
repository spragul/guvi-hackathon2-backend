
const Razorpay = require('razorpay');
var express = require('express');
const router = express.Router();
const { Order } = require('../schema/paymentSchema')
const mongoose = require('mongoose')
const { dbUrl } = require('../dbconfig/dbconfig')
mongoose.connect(dbUrl)
const { Adminvalidate, validate } = require('../dbconfig/auth');


router.use(express.json({ extended: false }));
router.get('/get-razorpay-key', (req, res) => {
  res.send({ key: process.env.RAZORPAY_KEY_ID });
});

router.post('/create-order', validate, async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });
    const options = {
      amount: req.body.amount,
      currency: 'INR',
    };
    const order = await instance.orders.create(options);
    if (!order) return res.status(500).send('Some error occured');
    res.send(order);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.post('/pay-order', validate, async (req, res) => {
  try {
    const { product, userId, amount, razorpayPaymentId, razorpayOrderId, razorpaySignature } =
      req.body;
    const newOrder = Order({
      product: product,
      userId: userId,
      isPaid: true,
      amount: amount,
      razorpay: {
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
        signature: razorpaySignature,
      },
    });
    await newOrder.save();
    res.send({
      rd: true,
      msg: 'Payment was successfull',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

//get all orders
router.get('/list-orders', Adminvalidate, async (req, res) => {
  const orders = await Order.find();
  res.send(orders);
});

//get user orders
router.get('/list-orders/:id', validate, async (req, res) => {
  const orders = await Order.find({ userId: req.params.id });
  res.send(orders);
});

module.exports = router;