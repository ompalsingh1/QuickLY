import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "enter name "],
  },
  email: {
    type: String,
    required: [true, "enter email"],
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: "",
  },
  phone: {
    type: Number,
    default: 0,
  },
  refresh_token: {
    type: String,
    default: "",
  },
  verify_email: {
    type: Boolean,
    default: false,
  },
  last_login_date:{
    type:Date,
    default:""
  },
  status:{
    type:String,
    enum : [ "active" , "inactive" , "suspended"],
    default: "active"
  },
  address_details: [
    {
        type: mongoose.Schema.ObjectId,
        ref: "address"
    }
  ],
  shopping_cart:[{
    type: mongoose.Schema.ObjectId,
    ref: "cartproduct"
  }],
  orderhistory:[{
    type:mongoose.Schema.ObjectId,
    ref:"order"
  }],
  forgot_password_otp:{
    type:String,
    default:null
  },
  forgot_password_expiry:{
    type:Date,
    default:""
  },
  role :{
    type:String,
    enum:["ADMIN","USER",],
    default:"USER"
  }
  
},{
    timestamps: true
});

const UserModel = mongoose.model("user",userSchema)

export default UserModel
