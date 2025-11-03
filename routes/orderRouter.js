import express from "express";
import {createOrderFromCart,getUserOrders,cancelOrderByUser,getAllOrdersForAdmin,getOrderDetails, getOrderByIdForAdmin, updateOrderStatus} from "../controllers/orderController.js";
import { isAuthenticated } from "../middlewares/userMiddleware.js";
import { isAdmin } from "../middlewares/adminMidlleware.js";

const router = express.Router();


router.post("/create", isAuthenticated, createOrderFromCart);
router.get("/my-orders", isAuthenticated, getUserOrders);
router.put("/cancel/:orderId", isAuthenticated, cancelOrderByUser);
router.get("/details/:orderId", isAuthenticated, getOrderDetails);

// Get all orders (Admin)
router.get("/admin/all", isAuthenticated,isAdmin, getAllOrdersForAdmin);

// Get single order by ID (Admin)
router.get("/admin/:id", isAuthenticated,isAdmin, getOrderByIdForAdmin);

// Update order status (Admin)
router.put("/admin/status/:id", isAuthenticated,isAdmin, updateOrderStatus);
export default router;