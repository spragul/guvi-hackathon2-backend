var express = require('express');
const router = express.Router();
const { UserModel } = require('../schema/userSchema')
const mongoose = require('mongoose')
const { dbUrl } = require('../dbconfig/dbconfig')
const { hashPassword, hashCompare, createToken, Adminvalidate } = require('../dbconfig/auth')
mongoose.connect(dbUrl)
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const saltRounds = 10


const nodemailer = require("nodemailer");

router.get('/', Adminvalidate, async (req, res) => {
  try {
    let user = await UserModel.find({}, { password: 0 });
    res.status(200).send({
      message: "user data fetch successful",
      user: user

    });

  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", error })
  }
});

router.post('/signup', async (req, res) => {
  try {
    let user = await UserModel.findOne({ email: req.body.email })
    if (!user) {
      let hashedPassword = await hashPassword(req.body.password)
      req.body.password = hashedPassword
      let user = await UserModel.create(req.body)

      res.status(201).send({
        message: "User Signup Successfull!"
      })
    }
    else {
      res.status(400).send({ message: "User Alread Exists!" })
    }

  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", error })
  }
})

router.post('/login', async (req, res) => {
  try {
    let user = await UserModel.findOne({ email: req.body.email })
    if (user) {
      //verify the password
      if (await hashCompare(req.body.password, user.password)) {
        // create the token
        let token = await createToken({
          name: user.name,
          email: user.email,
          id: user._id,
          role: user.role
        })

        res.status(200).send({
          message: "User Login Successfull!",
          token: token,
          myName: user.name,
          myRole: user.role,
          myid: user._id

        })
      }
      else {
        res.status(402).send({ message: "Invalid Credentials" })
      }
    }
    else {
      res.status(400).send({ message: "User Does Not Exists!" })
    }

  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", error })
  }
})

router.post('/forgotpassword', async (req, res) => {
  try {
    let user = await UserModel.findOne({ email: req.body.email })
    if (!user) {
      res.send({ message: "user not exists!!" })
    }
    const secret = process.env.SECRETKEY + user.password;
    let token = await jwt.sign({ email: user.email, id: user._id }, secret, { expiresIn: '15m' })
    const link = `https://nimble-babka-3e85ad.netlify.app/resetpassword/${user._id}/${token}`
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.G_MAIL,
        pass: process.env.G_MAIL_PASSWORD,
      }
    });
    let gmailId = await UserModel.findOne({ email: req.body.email })
    var mailOptions = {
      from: process.env.G_MAIL,
      to: gmailId.email,
      subject: 'Reset password',
      text: link
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.send(error)
      } else {
        res.send({ message: "meil send" })
      }
    });
  } catch (error) {
    res.send(error);
  }
})

router.post("/resetpassword/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = { password: req.body.password };
  const oldUser = await UserModel.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = process.env.SECRETKEY + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    const encryptedPassword = await bcrypt.hash(password, 10);
    await UserModel.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: encryptedPassword,
        },
      }
    );

    res.send({ email: verify.email, status: "verified" });
  } catch (error) {
    res.json({ status: "Something Went Wrong" });
  }
});

module.exports = router;