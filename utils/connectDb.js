import mongoose from "mongoose";

export const connectDb = async () => {
  const { connection } = await mongoose.connect(process.env.MONGO_URL);
  console.log(`MongoDB connected: ${connection.host}`);
};

// import mongoose from "mongoose";

// export const connectDb = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URL, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("MongoDB connected");
//   } catch (error) {
//     console.error("MongoDB connection error:", error);
//     process.exit(1);
//   }
// };
