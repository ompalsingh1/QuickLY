import { Router } from "express";
import uploadImageController from "../controllers/uploadImages.controller.js";
import auth from "../middleware/auth.js";
import isAdmin from "../middleware/isadmin.js";
import upload from "../middleware/multer.js";


const uploadRouter = Router()

uploadRouter.post("/upload",auth,isAdmin,upload.single('image'),uploadImageController)

export default uploadRouter