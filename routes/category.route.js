import { Router } from "express";
import auth from "../middleware/auth.js";
import {AddCategoryController} from "../controllers/category.controller.js"
import isAdmin from "../middleware/isadmin.js";

const categoryRouter = Router()

categoryRouter.post("/add-category",auth,isAdmin,AddCategoryController)

export default categoryRouter