import express, { json } from 'express';
import mongoose from 'mongoose';    
import dotenv from 'dotenv';    
import userRoutes from "./routes/users.js";
import commentRoutes from "./routes/comments.js";
import videoRoutes from "./routes/videos.js";
import authRoutes from "./routes/auth.js";
import cookieParser from 'cookie-parser';

const app = express();
dotenv.config();

const connect= () => {
    mongoose.connect(process.env.MONGO).then(() => {
        console.log('Connected DB');
    }
).catch((e) => {
    console.log(e);
    console.log('Connection failed');
})
};
app.use(cookieParser())
app.use(express.json())
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes); 
app.use("/api/comments", commentRoutes);
app.use("/api/auth", authRoutes);

// Global Error-handling Middleware
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
    console.log('Server is running on --- port 8800');
})