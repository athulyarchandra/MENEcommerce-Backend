import express,{Router} from "express";
import {  getAllUsers } from "../controllers/adminController.js";
import { isAuthenticated } from "../middlewares/userMiddleware.js";
import { isAdmin } from "../middlewares/adminMidlleware.js";
import { upload } from "../middlewares/multer.js"
import { editSinglePrdt, getAllProducts, getSingleProduct, removeSingleProduct } from "../controllers/productController.js";
import { updateUser } from "../controllers/userController.js";
import { deleteOrder } from "../controllers/orderController.js";
const router = express.Router()


router.get("/allUsers",isAuthenticated,isAdmin,getAllUsers)
//updateUser
router.put("/updateUserByAdmin/:id",isAuthenticated,isAdmin,upload.single("profilePic"),updateUser)
//getAllProducts
router.get("/getAllProducts",isAuthenticated,getAllProducts)
//singleProduct
router.get("/singleProduct/:id",isAuthenticated,getSingleProduct)
//deleteOrder
router.delete("/deleteOrder/:id", isAuthenticated, deleteOrder)
//getSingleProduct
router.get("/singleProduct/:id",isAuthenticated,isAdmin,getSingleProduct)
//updateProduct
router.put("/editProduct/:id",isAuthenticated,isAdmin,upload.array("productImages",5),editSinglePrdt)
//deleteProduct
router.delete("/deletePrdt/:id",isAuthenticated,isAdmin,removeSingleProduct)
//deleteOrder
router.delete("/deleteOrderByAdmin/:id", isAuthenticated, isAdmin, deleteOrder);

export default router



