var express = require('express');
const { productModel } = require('../schema/indexschema');
var { dbUrl } = require('../dbconfig/dbconfig');
var mongoose = require('mongoose');
var router = express.Router();
mongoose.connect(dbUrl)
const { validate, Adminvalidate } = require('../dbconfig/auth');

/* GET home page. */
router.get('/', validate, async function (req, res) {
  try {
    let product = await productModel.find();
    res.status(200).send({
      product
    })
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error
    })
  }

});

//inset product
router.post('/add/product', Adminvalidate, async (req, res) => {
  try {
    let product = await productModel.findOne({ id: req.body.id })
    if (!product) {
      let product = await productModel.create(req.body);
      res.status(200).send(product)
    } else {
      res.status(400).send({ message: "product Alreay existed" });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Error",
      error
    })
  }
})
//update product details
router.put('/product/edit/:id', Adminvalidate, async (req, res) => {
  try {
    let product = await productModel.findOne({ _id: req.params.id })
    if (product) {
      product.productName = req.body.productName
      product.categories = req.body.categories
      product.image = req.body.image
      product.model = req.body.model
      product.price = req.body.price
      await product.save()
      res.status(200).send({
        product,
        message: "product update successfully"
      })
    } else {
      res.status(400).send({ message: "product not exit" })
    }
  } catch (error) {
    res.status(500).send({ message: "internal server error" })
  }

})

//delete product
router.delete('/product/delete/:id', Adminvalidate, async (req, res) => {
  try {
    let product = await productModel.findOne({ _id: req.params.id })
    if (product) {
      let product = await productModel.deleteOne({ _id: req.params.id })
      res.status(200).send({
        message: "product Deleted Successfull!"
      })
    }
    else {
      res.status(400).send({ message: "product  Does Not Exists!" })
    }

  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error
    })

  }
})



module.exports = router;
