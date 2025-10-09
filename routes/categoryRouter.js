import express,{Router} from "express";
import { addCategory, deleteCategory, getAllCategories, getSingleCategory, updateCategory } from "../controllers/categoryController.js";
import { isAuthenticated } from "../middlewares/userMiddleware.js";
import { isAdmin } from "../middlewares/adminMidlleware.js";
import { upload } from "../middlewares/multer.js";


const router = express.Router();
//add
router.post("/add", isAuthenticated, isAdmin, upload.none(), addCategory);
//getAllCategory
router.get("/all", isAuthenticated, isAdmin, upload.none(), getAllCategories);
//getSingleCAtegory
router.get("/single/:id", isAuthenticated, isAdmin, upload.none(), getSingleCategory);
//updateSingleCategory
router.put("/update/:id", isAuthenticated, isAdmin, upload.none(), updateCategory);
//deleteCategory
router.delete("/delete/:id", isAuthenticated, isAdmin, upload.none(), deleteCategory);



export default router;
