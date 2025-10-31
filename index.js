import express from 'express'
import { connectDb } from './db/connectiondb.js'
import session from 'express-session'
import userRouter from './routes/userRouter.js'
import adminRouter from './routes/adminRouter.js'
import productRouter from './routes/productRouter.js'
import categoryRouter from './routes/categoryRouter.js'
import cartRouter from './routes/cartRouter.js'
import orderRouter from './routes/orderRouter.js'
import cors from 'cors'
// import reviewRouter from './routes/reviewRouter.js'
import MongoStore from 'connect-mongo'


const app = express()
app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true}))
app.use("/uploads", express.static("uploads"))
connectDb()

app.use(
    session({
        secret: "strongSecretKey",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: "mongodb://127.0.0.1:27017/enProject",
            collectionName: "session"
        })
    })
)


app.use('/admin', adminRouter)
app.use("/user", userRouter)
app.use("/adminOnly", productRouter)
app.use("/admin/category", categoryRouter)
app.use("/user/cart", cartRouter)
app.use("/orders", orderRouter)

// app.use("/review", reviewRouter)


app.get("/", (req, res) => {
    res.send("Server created successfully");
});


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server started running at port http://localhost:${PORT}`);

})




