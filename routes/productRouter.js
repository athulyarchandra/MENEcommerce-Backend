import express,{Router} from "express"
import { addProduct, getAllProducts } from "../controllers/productController.js"
import { upload } from "../middlewares/multer.js"
import { isAuthenticated } from "../middlewares/userMiddleware.js"
import { isAdmin } from "../middlewares/adminMidlleware.js"
const router = express.Router()

router.post("/add-Product",isAuthenticated,isAdmin,upload.array("productImages",3),addProduct)
router.get("/getAllProducts",isAuthenticated,isAdmin,getAllProducts)
router.get("/",getAllProducts)

export default router

