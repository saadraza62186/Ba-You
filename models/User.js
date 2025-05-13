import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        img : {
            type: String,
            default: "",
        },
        password: {
            type: String,
        },
        subscribers: {
            type: Number,
            default: 0,
        },
        subscribedUsers: {
            type: [String], // Array of user IDs
            default: [],
        },
        fromGoogle: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export default mongoose.model("User", UserSchema);
