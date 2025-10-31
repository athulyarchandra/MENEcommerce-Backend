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
    ,  // default empty string
    bio: {
        type: String
        , default: ""
    }
    ,         // default empty string
    age: {
        type: Number
        , default: null
    }
    ,       // default null
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
    ,     // default empty string
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
    }
});


const users = mongoose.model("users"
    , userSchema)

export default users