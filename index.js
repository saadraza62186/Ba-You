import express, { json } from 'express';
import mongoose from 'mongoose';    
import dotenv from 'dotenv';    
import userRoutes from "./routes/users.js";
import commentRoutes from "./routes/comments.js";
import videoRoutes from "./routes/videos.js";
import authRoutes from "./routes/auth.js";
import cookieParser from 'cookie-parser';
import cors from 'cors'; // 🔥 Add this

const app = express();
dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// 🔥 Add this middleware BEFORE all routes
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://youtube-ui-gamma.vercel.app", // ✅ Replace with your actual frontend domain
  ],
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes); 
app.use("/api/comments", commentRoutes);
app.use("/api/auth", authRoutes);

// Error handler
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Something went wrong';
    return res.status(status).json({
        success: false,
        status: status,
        message: message,
    });
});

app.listen(8800, () => {
    connect();
    console.log('Server is running on port 8800');
});
