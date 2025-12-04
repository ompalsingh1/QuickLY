import mongoose from "mongoose";

const cartproductSchema = new mongoose.Schema({
    productID:{
        type: mongoose.Schema.ObjectId,
        ref:"product"
    },
    quantity :{
        type:Number,
        default:1
    },
    userID:{
        type:mongoose.Schema.ObjectId,
        ref:"user"
    }

},{
    timestamps: true 
});

const CartProductModel = mongoose.Schema (cartproduct, cartproductSchema)


export default CartProductModel