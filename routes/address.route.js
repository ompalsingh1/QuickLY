import { Router } from "express";
import auth from "../middleware/auth.js";
import { AddAddressController } from "../controllers/address.controller.js";
// import isAdmin from "../middleware/isadmin.js";

const addressRouter = Router()

addressRouter.post("/add-address",auth,AddAddressController)

export default addressRouter ;