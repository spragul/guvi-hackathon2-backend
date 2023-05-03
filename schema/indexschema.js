const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  productName: { type: String, required: true },
  categories:{ type: String, required: true },
  model:{type:String,required:true},
  image:{type:String,required:true},
  price:{type:Number,required:true}



}
);

let productModel = mongoose.model('productAdmin', productSchema)
module.exports = { productModel }