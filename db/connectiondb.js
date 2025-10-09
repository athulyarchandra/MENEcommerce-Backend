import mongoose from "mongoose";

export const connectDb = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/enProject")
        console.log("Mongodb connected successfullyy..");
        
    }catch(err){
        console.log("Mongodb connection successfull..",err.message);
        
    }
}