import express,{Router} from "express";
import { getUserProfile, loginUser, updateUser, userRegister } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/userMiddleware.js";
import { upload } from "../middlewares/multer.js";
import { getAllProducts, getSingleProductByUser } from "../controllers/productController.js";

const router = express.Router()

//addUser
router.post("/register",userRegister)
//userLogin
router.post("/login",loginUser)
//getUser
router.get("/profile", getUserProfile);
//updateUser
router.put("/updateUser",isAuthenticated,upload.single("profilePic"),updateUser)
//getAllProducts
router.get("/getAllProducts",isAuthenticated,getAllProducts)
//singleProduct
router.get("/singleProduct/:id",getSingleProductByUser)


export default router