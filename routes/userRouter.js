import express,{Router} from "express";
import { loginUser, updateUser, userRegister } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/userMiddleware.js";
import { upload } from "../middlewares/multer.js";
import { getAllProducts, getSingleProduct } from "../controllers/productController.js";
import { deleteOrder } from "../controllers/orderController.js";

const router = express.Router()

//addUser
router.post("/register",userRegister)
//userLogin
router.post("/login",loginUser)
//updateUser
router.put("/updateUser",isAuthenticated,upload.single("profilePic"),updateUser)
//getAllProducts
router.get("/getAllProducts",isAuthenticated,getAllProducts)
//singleProduct
router.get("/singleProduct/:id",isAuthenticated,getSingleProduct)
//deleteOrder
router.delete("/deleteOrder/:id", isAuthenticated, deleteOrder);


export default router