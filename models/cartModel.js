import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
    },
    size: {
      type: String,
      default: "Default",
    },
    color: {
      type: String,
      default: "N/A",
    },
    brand: {
      type: String,
      default: "Unknown",
    },
    offer: {
      type: Number,
      default: 0, 
    },
    price: {
      type: Number,
      required: true,
    },
    subtotal: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [cartItemSchema],

    grandTotal: {
      type: Number,
      default: 0,
    },

    isCheckedOut: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);



cartSchema.pre("save", function (next) {
  const TAX_RATE_DEFAULT = 0.18; 

  this.items.forEach((item) => {
    const discount = (item.price * item.offer) / 100;
    const discountedPrice = item.price - discount;

    const taxRate = item.tax_rate || TAX_RATE_DEFAULT;
    const taxAmount = discountedPrice * taxRate;

    const finalPrice = discountedPrice + taxAmount;

    item.subtotal = finalPrice * item.quantity;
  });

  this.grandTotal = this.items.reduce((acc, curr) => acc + curr.subtotal, 0);
  next();
});

const Carts = mongoose.model("Cart", cartSchema);
export default Carts
