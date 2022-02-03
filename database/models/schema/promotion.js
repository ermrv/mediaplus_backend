const mongoose = require('mongoose');
var Schema = mongoose.Schema;


const PromotionSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'ContestThread'
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
    },
    days: {
        type: Number,
        Min: 1,
        Max: 90
    },
    userReach: {
        type: Number,
        default: 0
    },
    //calculated
    validUpTo: {
        type: Date,
    },
    redirectTo: {
        type: String,
        enum: ['link', 'profile'],
        default: 'link'
    },
    redirection: {
        type: String,
    },
    price: {
        type: Number,
        default: 500
    },
    paymentSuccess: {
        type: Boolean, 
        default: false
    },
    orderId: {
        type: String
    },
    razorpayPaymentId: {
        type: String
    }


}, { timestamps: true })


PromotionSchema.statics.checkPrice = async function (userReach, days) {
    try {
        price = userReach * days 

        if(price < 500){
            return 500;
        }
        else if( price < 2000){
            return price
        }
        else if( price < 5000){
            // 20 % less
            return Math.round(price * 0.8)
        }
        else{
            // 30% less
            return Math.round(price * 0.7)  
        }

    } catch (error) {
        throw error;
    }
}


PromotionSchema.statics.addPromotion = async function (userId, postId, days, userReach, redirectTo, redirection, price, ) {
    try {
        const data = {
            user: userId,
            post: postId,
            days: days, 
            userReach: userReach,
            validUpTo: new Date( Date.now() + (days* 86400000)),
            redirectTo: redirectTo,
            redirection: redirection,
            price, price,
            paymentSuccess: false
        }

        const  newPromotion = await this.create(data)

        return newPromotion ;
    } catch (error) {
        throw error;
    }
}


var Promotion = mongoose.model('Promotion', PromotionSchema)
module.exports = Promotion;