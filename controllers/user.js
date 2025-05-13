import { CreateError } from "../error.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

export const update = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      // Update the user
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body }, // Corrected `req.body`
        { new: true } // Ensures the updated document is returned
      );

      // Check if user was found and updated
      if (!updatedUser) {
        return next(CreateError(404, "User not found"));
      }

      // Send success response
      res.status(200).json({
        message: "User updated successfully",
        data: updatedUser,
      });
    } catch (err) {
      next(err); // Forward the error to the error handler middleware
    }
  } else {
    // User is not authorized to update another user's account
    return next(CreateError(403, "You can update only your account!"));
  }
};

export const deleteUser = async (req, res, next) => {
    if (req.params.id === req.user.id) {
        try {
          // Update the user
          const updatedUser = await User.findOneAndDelete(
            req.params.id,
          );
          
          res.status(200).json({
            message: "User has been deleted",
          });
        } catch (err) {
          next(err); // Forward the error to the error handler middleware
        }
      } else {
        // User is not authorized to update another user's account
        return next(CreateError(403, "You can delete only your account!"));
      }
};
export const getUser = async (req, res, next) => {
  try{
    const user = await User.findById(req.params.id)
    res.status(200).json(user) 
  } catch(err){
    next(err)
  }
};
export const subscribed = async (req, res, next) => {
  try {
    // Push the subscription to the subscribedUsers array
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { subscribedUsers: req.params.id } },  // Correct use of $push
      { new: true } // To return the updated document (optional)
    );

    // Increment the subscriber count for the target user
    await User.findByIdAndUpdate(
      req.params.id,
      { $inc: { subscribers: 1 } }  // Correct use of $inc
    );

    res.status(200).json("Subscription Successful");
  } catch (err) {
    next(err); // Pass the error to error handling middleware
  }
};

export const unsubscribed = async (req, res, next) => {
  try{
    await User.findByIdAndUpdate(req.user.id,{
      $pull:{subscribedUsers : req.params.id},
    });
    await User.findByIdAndUpdate(req.params.id,{
      $inc : {subscribers : -1},
    });
    res.status(200).json("Unsubscription Successfull")
}
 catch(err){
  next(err)
}};
export const like = async (req, res, next) => {
  const id = req.user.id;
  const videoId = req.params.videoId;
  try{
    await Video.findByIdAndUpdate(videoId,{
      $addToSet : {likes : id},
      $pull : {dislikes : id},
    })
    res.status(200).json("The Video has been liked")
  }
 catch(err){
  next(err)
}};
export const diskile = async (req, res, next) => {
  const id = req.user.id;
  const videoId = req.params.videoId;
  try{
    await Video.findByIdAndUpdate(videoId,{
      $addToSet : {dislikes : id},
      $pull : {likes : id},
    })
    res.status(200).json("The Video has been disliked")
  }
 catch(err){
  next(err)
}};
