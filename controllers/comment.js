import { CreateError } from "../error.js";
import Video from "../models/Video.js";
import Comment from "../models/Comment.js"; // Correct import
// Add a comment
export const addComment = async (req, res, next) => {
  const newComment = new Comment({ ...req.body, userId: req.user.id });
  try {
    const savedComment = await newComment.save();
    res.status(200).send(savedComment);
  } catch (err) {
    next(err);
  }
};

// Delete a comment
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return next(CreateError(404, "Comment not found"));

    const video = await Video.findById(comment.videoId); // Fetch video using comment's videoId
    if (!video) return next(CreateError(404, "Video not found"));

    if (req.user.id === comment.userId || req.user.id === video.userId) {
      await Comment.findByIdAndDelete(req.params.id);
      res.status(200).json("The comment has been deleted");
    } else {
      return next(CreateError(403, "You can delete only your comment!"));
    }
  } catch (err) {
    next(err);
  }
};

// Get comments for a video
export const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId });
    res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
};
