import express,{Router} from "express"
import { addToCart, checkoutCart, getCart, removeCartItem, updateCartItem } from "../controllers/cartController.js";
import { isAuthenticated } from "../middlewares/userMiddleware.js";


const router = express.Router()
//addCart
router.post("/add",isAuthenticated,addToCart)
//grtCart
router.get("/",isAuthenticated,getCart)
//updateCart
router.put("/update/:productId", isAuthenticated, updateCartItem);
//removeItem from cart
router.delete("/remove/:productId", isAuthenticated, removeCartItem);
//clearCArt
router.post("/clear", isAuthenticated, checkoutCart);

export default router