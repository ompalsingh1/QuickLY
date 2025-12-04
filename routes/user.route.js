import { Router} from "express";
import {registerUserController, loginUserController, logoutUserController,uploadAvatar,
    forgetPasswordController, updateUserDetails,verifyForgetPasswordOtp,resetPassword,refreshToken} from "../controllers/user.controller.js"
import auth from '../middleware/auth.js'
import upload from "../middleware/multer.js";
import isAdmin from "../middleware/isadmin.js";

const userRouter = Router()

userRouter.post("/register",registerUserController)
userRouter.post("/login",loginUserController)
userRouter.get("/logout",auth,logoutUserController)
userRouter.put("/update-avatar",auth,upload.single('avatar'),uploadAvatar)
userRouter.put("/update-user",auth,updateUserDetails)
userRouter.post("/forget-password",forgetPasswordController)
userRouter.put("/verify-ForgetPassword-Otp",verifyForgetPasswordOtp)
userRouter.put("/reset-password",resetPassword)
userRouter.post("/refresh_Token",refreshToken)

export default userRouter ;