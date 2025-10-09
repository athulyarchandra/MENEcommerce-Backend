import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
      name: { type: String, required: true, unique: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now }
})

const Categories = mongoose.model("Categories",categorySchema)
export default Categories