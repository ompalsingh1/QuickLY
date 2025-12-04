import AddSubCategoryController from "../controllers/subcategory.controller.js";
import express from "express";
import auth from "../middleware/auth.js";
import isAdmin from "../middleware/isadmin.js";

const subcategoryRouter = express.Router();

subcategoryRouter.post("/add-subcategory", auth, isAdmin, AddSubCategoryController);

export default subcategoryRouter ;