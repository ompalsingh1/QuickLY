import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userID:{
        type:mongoose.Schema.ObjectId,
        ref:"user"
    },
    orderID:{
        type:String,
        required: [true,"provide orderID"],
        unique:true
    },
    productID: {
        type:mongoose.Schema.ObjectId,
        ref:"product"
    },
    product_details:{
        name:String,
        image:Array
    },
    paymentID : {
        type:String,
        default:""
    },
    payment_status :{
        type:String,
        default:""
    },
    delivery_address:{
        type:mongoose.Schema.ObjectId,
        ref:"address"
    },
    subtotalamt:{
        type:Number,
        default:0
    },
    totalamt :{
        type:Number,
        default:0
    }, 
    invoice_receipt :{
        type:String,
        default:""
    }

}, {
    timestamps:true
});

const OrderModel = mongoose.model("order",orderSchema)

export default OrderModel