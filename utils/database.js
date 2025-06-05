import mongoose from "mongoose";

let isConnected = false;
export const connectToDB = async () => {
	mongoose.set("strictQuery", true);

	if (isConnected) {
		console.log("MongoDB is already connected");
		return;
	}

	try {
		await mongoose.connect(process.env.MONGODB_URI, {
			dbName: "Leveling_System",
		});
		isConnected = true;
		console.log("MongoDB connected");
	} catch (error) {
		console.log("MongoDB connection failed", error);
	}
}