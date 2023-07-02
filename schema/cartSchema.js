const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  productName: {
    type: String,
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  cartTotal: {
    type: Number,
    required: false,
  },
  createdOn: {
    type: Date,
    default: Date.now(),
  },
  startingDate: {
    type: Date,
    required: true
  },
  endingDate: {
    type: Date,
    required: true
  },
  updateOn: {
    type: Date,
    default: Date.now(),
  },
  price: {
    type: Number,
    required: false
  }
});
let cartModel = mongoose.model('carts', cartSchema)
module.exports = { cartModel }
