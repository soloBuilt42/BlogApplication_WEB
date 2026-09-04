import mongoose from "mongoose";

const dbConnection = async() =>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("DB is connected");
    }
    catch(error){
        console.log("DB Error" + error);
    
    }
}

export default dbConnection;