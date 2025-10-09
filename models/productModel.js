import mongoose from "mongoose";
const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    username: {
        type: String,
        required: true
    },
    rating: {
        type: Number, 
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const productSchema = new mongoose.Schema({
    productCode: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    available_country: { type: String, required: true },
    tax_rate: { type: Number, default: 0 },
    color: { type: String, required: true },
    size: { type: String, required: true },
    stock: { type: Number, default: 0, required: true },
    category: { type: String, required: true },
    offer: { type: Number, default: 0 },
    description: { type: String, required: true },
    brand: { type: String },
    ratings: { type: Number, default: 0 }, 
    productImages: [{ type: String }],
    reviews: [reviewSchema], 
    createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model("Product", productSchema);
export default Product;
