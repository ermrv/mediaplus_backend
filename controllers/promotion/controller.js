//.........................ALL Imports............................
const db = require('../../database/models');
require('dotenv').config()
var _ = require('lodash');

// razorpay

const crypto = require("crypto");
const Razorpay = require("razorpay");

const instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});



//....................ALL Photos Page Routes.......................

exports.checkPrice = async (req, res) => {
  try {
    const { userReach, days } = req.body
    if (!userReach || !days) {
      res.status(400).json({ error: "Enter required field.!" })
    } else {
      price = await db.promotion.checkPrice(userReach, days)
      res.status(200).json({ 
        price: price,
      })
    }

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.promotePost = async (req, res) => {
  try {
    const { postId, userReach, days, redirectTo, redirection } = req.body

    if (!userReach || !days || !postId || !redirectTo || !redirection) {
      res.status(400).json({ error: "Enter required field.!" })
    } else {

      price = await db.promotion.checkPrice(userReach, days)

      promotionData = await db.promotion.addPromotion(req.userData.userId, postId, days, userReach, redirectTo, redirection, price,)

      res.status(200).json({
        promotionAdded: true,
        key: process.env.KEY_ID,
        promotion: promotionData
      })
    }

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}


exports.razorpayKey = async (req, res) => {
  try {
    res.status(200).json({ 
      key: process.env.KEY_ID,

     })
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.paymentOrder = async (req, res) => {
  try {
    const { promotionId } = req.body
    if (!promotionId) {
      req.status(400).json({ error: "enter required field.!" })

    } else {
      // search promotion
      promotion = await db.promotion.findById(promotionId)

      // data
      const data = {
        amount: promotion.price * 100,
        currency: "INR",
        payment_capture: "1",
        receipt: "wthcoding001"
      }

      createPayment = await instance.orders.create(data)

      // update promotion
      updatePromotion = await db.promotion.findByIdAndUpdate(promotionId, { $set: { orderId: createPayment.id } })


      res.status(200).json({
        paymentData: createPayment,
        status: "success"
      })

    }


  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

}

exports.paymentVerify = async (req, res) => {
  try {
    const { promotionId, razorpayPaymentId, razorpaySignature } = req.body
    if (!promotionId || !razorpayPaymentId || !razorpaySignature) {
      res.status(400).json({ error: "Enter required field.!" })

    } else {
      // search promotion
      promotion = await db.promotion.findById(promotionId)

      body = promotion.orderId + "|" + razorpayPaymentId
      var expectedSignature = await crypto
        .createHmac("sha256", process.env.KEY_SECRET)
        .update(body.toString())
        .digest("hex");
        console.log("orderId: " + promotion.orderId)
        console.log("paymentId: "+ razorpayPaymentId)
        console.log("expected: "+ expectedSignature)
        console.log("razorpay: "+ razorpaySignature)

      if (expectedSignature === razorpaySignature) {

        // successful payment

        const razorpayData = {
          razorpayPaymentId: razorpayPaymentId,
          paymentSuccess: true
        }

        // update promotion 
        updatePromotion = await db.promotion.findByIdAndUpdate(promotionId, { set: razorpayData }, { new: true })

        const postUpdate = {
          promoted: true,
          redirectTo: promotion.redirectTo,
          redirection: promotion.redirection
        }

        // updatePost
        updatePost = await db.post.findByIdAndUpdate(promotion.post, { $set: postUpdate }, { new: true })


        res.status(200).json({
          status: "success",
          updatedPost: updatePost
        })

      }
      else {
        res.status(300).json({
          status: "failure",
          error: 'signature not matched.!'
        })
      }
    }





  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

}

exports.allPromotions = async ( res, req ) => {
  try{
    

  }catch(error){
    return res.status(500).json({ error: error.message });
  }
}