import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
    },
    bio: {
        type: String,
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"]
    },
    address: {
        type: String,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    createdAt: { type: Date, default: Date.now }
})

const users = mongoose.model("users", userSchema)

export default users