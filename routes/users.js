import express from "express";
import {
    deleteUser,
    diskile,
    getUser,
    like,
    subscribed,
    unsubscribed,
    update,
} from "../controllers/user.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

// Update user (requires authentication)
router.put('/:id', verifyToken, update);

// Delete user (requires authentication)
router.delete('/:id', verifyToken, deleteUser);

// Get a user (public route)
router.get('/find/:id', getUser);

// Subscribe to a user (requires authentication)
router.put('/sub/:id', verifyToken, subscribed);

// Unsubscribe from a user (requires authentication)
router.put('/unsub/:id', verifyToken, unsubscribed);

// Like a video (requires authentication)
router.put('/like/:videoId', verifyToken, like);

// Dislike a video (requires authentication)
router.put('/dislike/:videoId', verifyToken, diskile);

export default router;
