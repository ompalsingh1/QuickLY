import UserModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import generatedAccessToken from "../utils/generateAccessToken.js";
import generatedRefreshToken from "../utils/generateRefreshToken.js";
import dotenv from 'dotenv'
dotenv.config()
import uploadImageCloudinary from '../utils/uploadImageCloudinary.js'
// import auth from "../middleware/auth.js";
import generateOtp from "../utils/generateOTP.js"
import forgetPasswordTemplate from "../utils/forgetPasswordTemplate.js"
import sendEmail from "../config/sendEmail.js";
import verificationEmailTemplate from '../utils/verifyEmailTemplate.js'
import jwt from "jsonwebtoken"

// Register user
export async function registerUserController(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(500).json({ message: " provide name, email, password" });
    }
    const user = await UserModel.findOne({ email });
    if (user) {
      res.status(400).json({ message: "user already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const payload = {
      name,
      email,
      password: hashPassword,
    };

    const newUser = new UserModel(payload);
    const save = await newUser.save();

    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save._id}`

    const verifyEmail = await sendEmail({
      from: "QuickLY <onboarding@resend.dev>",
      sendTo : email,
      subject : "verification email",
      html : verificationEmailTemplate({
        name : name ,
        url : verifyEmailUrl

      })
    })

    return res.status(200).json({ message: "user registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Login user
export async function loginUserController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(500).json({ message: " provide email, password" });
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "user not found " });
    }
    if (user.status !== "active") {
      res.status(400).json({ message: "contact ADMIN " });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

     const accesstoken = await generatedAccessToken(user)
     const refreshtoken = await generatedRefreshToken(user._id)

     const cookieOption = {
      httpOnly : true,
      secure : false,
      sameSite :"None"
    }
    res.cookie('accesstoken',accesstoken,cookieOption)
    res.cookie('refreshtoken',refreshtoken,cookieOption)

    res.status(200).json({ msg: "Login successful", data : {
      accesstoken,
      refreshtoken

    }
     });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


//Logout user
export async function logoutUserController(req,res) {
  try {
    const userid = req.userId //middleware
    
    const cookieOption = {
      httpOnly : true,
      secure : false,
      // sameSite :"None"
    }
    res.clearCookie("accesstoken",cookieOption)
    res.clearCookie("refreshtoken",cookieOption)

    const removeRefreshToken = await UserModel.findByIdAndUpdate(userid,{refresh_token :""})
    res.status(200).json({message : "logout successfully"})

  } catch (error) {
    res.status(500).json({message:error.message})
  }
}

// upload user avatar
export async function uploadAvatar(req,res) {
  try {
    const userId = req.userId //auth middleware
    const image = req.file //multer middleware

    const upload = await uploadImageCloudinary(image)

    const updateUser = await UserModel.findByIdAndUpdate(userId,{
      avatar : upload.url
    })
    res.json({message: "profile photo updated",
      data : {
        _id :userId,
        avatar: upload.url
      }
    })

  } catch (error) {
    res.status(500).json({message:error.message})
  }
  
}

// update urer details
export async function updateUserDetails(req,res) {
  try {
    const userId = req.userId
    const {name , email , phone, password} = req.body

    let hashPassword = ""

    if (password) {
          const salt = await bcrypt.genSalt(10);
          hashPassword = await bcrypt.hash(password, salt);
    }

    const updateUser = await UserModel.updateOne({_id : userId},{
      ...(name && {name : name}),
      ...(email && {email : email}),
      ...(phone && {phone : phone}),
      ...(password && {password : hashPassword})
      
    })
    


    return res.json({message: "user updated successfully"})

  } catch (error) {
    res.status(500).json({message:error.message})
    
  }
  
}

//forget password
export async function forgetPasswordController(req,res) {
  try {
    const {email} = req.body

    const user =await UserModel.findOne({email})

    if (!user){
      res.status(400).json({message:"user not exist"})

    }

    const otp = generateOtp()
    const expireTime = new Date()+60*60*1000 //1h

    const update = await UserModel.findByIdAndUpdate(user._id,{
      forgot_password_otp : otp,
      forgot_password_expiry : new Date(expireTime).toISOString()

    })

    await sendEmail({
      sendTo : email,
      subject : "forget password from QuickLY",
      html : forgetPasswordTemplate({
        name : user.name,
        otp : otp
      })
    })

    return res.json({message:"enter otp"})
    
  } catch (error) {
    res.status(500).json({message:error.message})
    
  }
  
}

//verify forget-password otp

export async function verifyForgetPasswordOtp(req,res) {
  try {
    const {email,otp} = req.body

    if (!email || !otp){
      res.status(400).json({message:"provide email and otp"})
    }
     const user = await UserModel.findOne({email})

    if (!user){
      res.status(400).json({message:"email not available"})
    }

    const currentTime = new Date().toISOString()
    if (user.forgot_password_expiry < currentTime){
      res.status(400).json({message:"otp expired"})
    }

    if(otp !==user.forgot_password_otp){
      res.status(400).json({message:"invalid otp"})

    }

    return res.status(200).json({message:"otp verified"})
   
  } catch (error) {
    res.status(500).json({message: error.message})
    
  }
  
}

// reset password
export async function resetPassword(req,res) {
  try {
    const {email, newPassword, confirmPassword} = req.body
    if (!email || ! newPassword || !confirmPassword){
      res.status(400).json({message:"provide email , newPassword , and confirmPassword"})
    }

    const user = await UserModel.findOne({email})
    if (!user){
      res.status(400).json({message:"email not available"})
    }

    if (newPassword !== confirmPassword){
      res.status(400).json({message:"newPassword and confirmPassword must be same"})
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);

    const update = await UserModel.findByIdAndUpdate(user._id,{
      password : hashPassword
    })
    return res.status(200).json({message:"password updated successfully"})

    
  } catch (error) {
    res.status(500).json({message:error.message})
    
  }
  
}

//refresh token controller 

export async function refreshToken(req,res) {
  try {
    const refreshToken = req.cookies.refreshtoken || req?.headers?.
    authorization?.split(" ")[1] /// ["bearer","token"]

    if(!refreshToken){
      return res.status(402).json({message:"refresh token expired"})
    }

    const verifytoken = await jwt.verify(refreshToken,process.env.SECRET_KEY_REFRESH_TOKEN)
    if (!verifytoken){
      res.status(401).json({message:"token expired"})
    }
    console.log("verifytoken",verifytoken)
    const userId = verifytoken?._id

    const newAccessToken = await generatedAccessToken(userId)
     
    const cookieOption = {
      httpOnly : true,
      secure : true,  
      sameSite :"None"
    }

    res.cookie ("accesstoken",newAccessToken,cookieOption)
    
    return res.status(200).json({message:"newaccesstoken generated",
      data : {
        accesstoken :newAccessToken

      }
    })

  } catch (error) {
    res.status(500).json({message:error.message})
    
  }
  
}