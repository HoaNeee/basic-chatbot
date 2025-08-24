import mongoose from "mongoose";

const URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/basic-chatbot";

let isConnected = false;

const connectDB = async () => {
  try {
    if (isConnected) {
      console.log("Already connected to MongoDB");
      return;
    }

    if (mongoose.connections.length > 0) {
      isConnected = mongoose.connections[0].readyState === 1;
      if (isConnected) {
        console.log("Already connected to MongoDB");
        return;
      }
    }

    await mongoose.connect(URI);
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectDB;
