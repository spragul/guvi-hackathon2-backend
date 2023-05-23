var express = require('express');
const { productModel } = require('../schema/indexschema');
var { dbUrl } = require('../dbconfig/dbconfig');
var mongoose = require('mongoose');
const {validate} = require('../dbconfig/auth')
var router = express.Router();
mongoose.connect(dbUrl)


/* GET home page. */
router.get('/',validate, async function (req, res) {
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
router.post('/add/product', async (req, res) => {
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
router.put('/product/edit/:id', async (req, res) => {
  try {
    console.log(req.params.id);
    let product = await productModel.findOne({ id: req.params.id })
    if (product) {
      product.id = req.body.id
      product.mobileName = req.body.mobileName
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
router.delete('/product/delete/:id', async (req, res) => {
  try {
    let product = await productModel.findOne({ id: req.params.id })
    if (product) {
      let product = await productModel.deleteOne({ id: req.params.id })
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
