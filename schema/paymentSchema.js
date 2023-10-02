const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
  product: { type: Object, required: true },
  userId: { type: String, required: true },
  isPaid: Boolean,
  amount: Number,
  razorpay: {
    orderId: String,
    paymentId: String,
    signature: String,
  },
});
let Order = mongoose.model('Order', OrderSchema)
module.exports = { Order }