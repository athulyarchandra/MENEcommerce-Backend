import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      price: Number,
      quantity: Number,
      color: String,
      size: String,
      brand: String,
      offer: Number,
      subtotal: Number
    }
  ],
  grandTotal: Number,
  shippingAddress: String,
  paymentMethod: String,
  status: {
    type: String,
    enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
const Orders = mongoose.model("Orders", orderSchema);

export default Orders
