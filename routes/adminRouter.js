import express, { Router } from "express";
import { getAllUsers } from "../controllers/adminController.js";
import { isAuthenticated } from "../middlewares/userMiddleware.js";
import { isAdmin } from "../middlewares/adminMidlleware.js";
import { upload } from "../middlewares/multer.js"
import { editSinglePrdt, getAllProducts, removeSingleProduct } from "../controllers/productController.js";
import { updateUser } from "../controllers/userController.js";
const router = express.Router()


router.get("/allUsers", isAuthenticated, isAdmin, getAllUsers)
//updateUser
router.put("/updateUserByAdmin/:id", isAuthenticated, isAdmin, upload.single("profilePic"), updateUser)
//getAllProducts
router.get("/getAllProducts", isAuthenticated, getAllProducts)
//edit
router.put("/editProduct/:id", isAuthenticated, isAdmin, upload.array("productImages", 5), editSinglePrdt)
//deleteProduct
router.delete("/deletePrdt/:id", isAuthenticated, isAdmin, removeSingleProduct)

export default router



