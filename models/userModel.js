import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String
        , required: true
    }
    ,
    email: {
        type: String
        , required: true
        , unique: true
    }
    ,
    password: {
        type: String
        , required: true
    }
    ,
    profilePic: {
        type: String
        , default: ""
    }
    ,
    bio: {
        type: String
        , default: ""
    }
    ,
    age: {
        type: Number
        , default: null
    }
    ,
    gender: {
        type: String
        , enum: ["Male"
            , "Female"
            , "Other"
            , ""]
        , default: ""
    }
    ,
    address: {
        type: String
        , default: ""
    }
    ,
    role: {
        type: String
        , enum: ["user"
            , "admin"]
        , default: "user"
    }
    ,
    createdAt: {
        type: Date
        , default: Date.now
    },
    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active",
    },
});


const users = mongoose.model("users"
    , userSchema)

export default users