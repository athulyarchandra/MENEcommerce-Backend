import express,{Router} from "express"
import {addToCart,getCart,updateCartItem,removeCartItem,clearCart,checkoutCart} from "../controllers/cartController.js";import { isAuthenticated } from "../middlewares/userMiddleware.js";


const router = express.Router()

// CREATE 
router.post("/add", isAuthenticated, addToCart);

// READ
router.get("/", isAuthenticated, getCart);

// UPDATE 
router.put("/update/:productId", isAuthenticated, updateCartItem);

// DELETE
router.delete("/remove/:productId", isAuthenticated, removeCartItem);

// DELETE 
router.delete("/clear", isAuthenticated, clearCart);

// CHECKOUT cart
router.post("/checkout", isAuthenticated, checkoutCart);

export default router;
