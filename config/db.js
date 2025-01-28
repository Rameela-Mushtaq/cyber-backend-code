import mongoose from "mongoose";

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("MongoDb Connected")

    } catch (error) {
        console.error("MongoDb is not connected");
        process.exit(0);
    }
}

export default connectDb;