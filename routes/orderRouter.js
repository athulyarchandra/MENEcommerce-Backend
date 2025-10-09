import express from "express";
import { isAuthenticated } from "../middlewares/userMiddleware.js";
import { isAdmin } from "../middlewares/adminMidlleware.js";
import { deleteOrder, getAllOrders, getMyOrders, updateOrder } from "../controllers/orderController.js";

const router = express.Router()

//getOrders
router.get("/",isAuthenticated,getMyOrders)
//getAllOrderDetails
router.get("/allOrders",isAuthenticated,isAdmin,getAllOrders)
//updateOrdere-User
router.put("/updateOrderbyUser/:id", isAuthenticated, updateOrder);
//updateOrder
router.put("/updateOrder/:id", isAuthenticated, isAdmin, updateOrder);
//deleteOrder
router.delete("/deleteOrder/:id", isAuthenticated, isAdmin, deleteOrder);


export default router