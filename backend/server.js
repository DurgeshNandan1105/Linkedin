import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import postRoutes from "./routes/posts.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(postRoutes);
app.use(userRoutes);


mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log("Connected!");
})
.catch((err) => {
    console.log("MongoDb connection error:", err);
});

app.listen(9090, () => {
  console.log("server is running on port 9090");
});
