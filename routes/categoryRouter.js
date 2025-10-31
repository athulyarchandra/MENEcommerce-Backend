import express,{Router} from "express";
import { addCategory, deleteCategory, getAllCategories, getSingleCategory, updateCategory } from "../controllers/categoryController.js";
import { isAuthenticated } from "../middlewares/userMiddleware.js";
import { isAdmin } from "../middlewares/adminMidlleware.js";
import { upload } from "../middlewares/multer.js";


const router = express.Router();
//add
router.post("/add", isAuthenticated, isAdmin, addCategory);
//getAllCategory
router.get("/all", isAuthenticated, isAdmin, getAllCategories);
//getSingleCAtegory
router.get("/single/:id", isAuthenticated, isAdmin, getSingleCategory);
//updateSingleCategory
router.put("/update/:id", isAuthenticated, isAdmin, updateCategory);
//deleteCategory
router.delete("/delete/:id", isAuthenticated, isAdmin, deleteCategory);



export default router;
