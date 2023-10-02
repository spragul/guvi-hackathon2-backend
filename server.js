import { app } from "./app.js";
import Razorpay from "razorpay";
const mongoose = require('mongoose')
const { dbUrl } = require('../dbconfig/dbconfig')
mongoose.connect(dbUrl)

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_APT_SECRET,
});

app.listen(process.env.PORT, () =>
  console.log(`Server is working on ${process.env.PORT}`)
);