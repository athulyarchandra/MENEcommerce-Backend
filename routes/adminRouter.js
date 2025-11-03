import express, { Router } from "express";
import { getAllUsers } from "../controllers/adminController.js";
import { isAuthenticated } from "../middlewares/userMiddleware.js";
import { isAdmin } from "../middlewares/adminMidlleware.js";
import { upload } from "../middlewares/multer.js"
import { editSinglePrdt, getAllProducts, removeSingleProduct } from "../controllers/productController.js";
import { updateUser, updateUserStatus } from "../controllers/userController.js";
const router = express.Router()


router.get("/allUsers", isAuthenticated, isAdmin, getAllUsers)
//updateUser
router.put("/updateUserByAdmin/:id", isAuthenticated, isAdmin, upload.single("profilePic"), updateUser)
//getAllProducts
router.get("/getAllProducts", isAuthenticated, getAllProducts)
//edit
router.put("/edit-Product/:id", isAuthenticated, isAdmin, upload.array("productImages", 3), editSinglePrdt)
//deleteProduct
router.delete("/deletePrdt/:id", isAuthenticated, isAdmin, removeSingleProduct)
//enable/Disable user (Admin only)
router.patch("/users/:id/status", isAuthenticated, isAdmin, updateUserStatus);

export default router



