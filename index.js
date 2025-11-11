import dotenv from "dotenv";
dotenv.config();

import express from "express";
import session from "express-session";
import cors from "cors";
import MongoStore from "connect-mongo";

import userRouter from "./routes/userRouter.js";
import adminRouter from "./routes/adminRouter.js";
import productRouter from "./routes/productRouter.js";
import categoryRouter from "./routes/categoryRouter.js";
import cartRouter from "./routes/cartRouter.js";
import orderRouter from "./routes/orderRouter.js";

import "./db/connectiondb.js";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173", 
      "http://13.60.49.139:3000", 
    ],
    credentials: true,
  })
);

app.use("/uploads", express.static("uploads"));

app.use(
  session({
    secret: "strongSecretKey",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DBCONNECTIONSTRING,
      collectionName: "session",
    }),
  })
);

app.use("/admin", adminRouter);
app.use("/user", userRouter);
app.use("/adminOnly", productRouter);
app.use("/admin/category", categoryRouter);
app.use("/user/cart", cartRouter);
app.use("/orders", orderRouter);
// app.use("/review", reviewRouter);

app.get("/", (req, res) => {
  res.send("✅ Server is running successfully!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started running at http://localhost:${PORT}`);
});
