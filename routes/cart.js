var express = require('express');
const router = express.Router();
const {cartModel} = require('../schema/cartSchema')
const mongoose = require('mongoose')
const {dbUrl} = require('../dbconfig/dbconfig')
const {hashPassword,hashCompare,createToken,validate} = require('../dbconfig/auth')
mongoose.connect(dbUrl)
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const saltRounds = 10


router.get('/',async(req, res)=> {
  try {
  let carts =await cartModel.find({});
    res.status(200).send({
      carts
    })
  } catch (error) {
    res.status(500).send({message:"Internal Server Error",error})
  }
});

router.post('/create/:productId', async (req, res) => {
  try {
    let product = await cartModel.findOne({ id: req.params.id })
    console.log(product);
    if (product) {
      let product = await cartModel.create(req.body);
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
router.delete('/delete/:id', async (req, res) => {
  try {
    let product = await cartModel.findOne({ id: req.params._id })
    if (product) {
      let product = await cartModel.deleteOne({ id: req.params._id })
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