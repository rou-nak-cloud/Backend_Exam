import mongoose from "mongoose";

export async function dbConnect() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Database is connected.`);
  } catch (error) {
    console.log(`Database is not connected.`);
    process.exit(1);
  }
}
