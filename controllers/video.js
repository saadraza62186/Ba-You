import { CreateError } from "../error.js";  // Added .js extension for correct import
import Video from "../models/Video.js";
import User from "../models/User.js";
// Add a new video
export const addVideo = async (req, res, next) => {
  const newVideo = new Video({ userId: req.user.id, ...req.body });
  try {
    const savedVideo = await newVideo.save();
    res.status(200).json(savedVideo);
  } catch (err) {
    next(err);
  }
};

// Update an existing video
export const updateVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return next(CreateError(404, "Video not found"));
    }

    if (req.user.id === video.userId) {
      const updatedVideo = await Video.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true } // Return the updated document
      );
      return res.status(200).json(updatedVideo); // Correct response
    } else {
      return next(CreateError(403, "You are not authorized to update this video"));
    }
  } catch (err) {
    next(err); // Pass the error to error handling middleware
  }
};

// Delete a video
export const deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return next(CreateError(404, "Video not found"));
    }
    if (req.user.id === video.userId) {
      await Video.findByIdAndDelete(req.params.id); // Use findByIdAndDelete
      return res.status(200).json({ message: "Video deleted successfully" });
    } else {
      return next(CreateError(403, "You are not authorized to delete this video"));
    }
  } catch (err) {
    next(err); // Pass the error to error handling middleware
  }
};

// Get a video
export const getVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    res.status(200).json(video); // Return video if found
  } catch (err) {
    next(err); // Pass the error to error handling middleware
  }
};

//Add a view

export const addView = async (req, res, next) => {
    try {
      await Video.findByIdAndUpdate(req.params.id,{
        $inc: { views: 1 }
      });
      res.status(200).json("The view has been added"); // Return video if found
    } catch (err) {
      next(err); // Pass the error to error handling middleware
    }
  };
  
//Add a random

  export const random = async (req, res, next) => {
    try {
      const videos = await Video.aggregate([{ $sample:{ size: 40}}]);
      res.status(200).json(videos); // Return video if found
    } catch (err) {
      next(err); // Pass the error to error handling middleware
    }
  };

  export const trend = async (req, res, next) => {
    try {
      const videos = await Video.find().sort({ views: -1 });
      res.status(200).json(videos); // Return video if found
    } catch (err) {
      next(err); // Pass the error to error handling middleware
    }
  };
  export const sub = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const subscribedChannels = user.subscribedUsers;

        const lists = await  Promise.all(
            subscribedChannels.map((channelId) => {
                return Video.find({ userId: channelId });
            }
        ));
        res.status(200).json(lists.flat().sort((a,b) => b.createdAt - a.createdAt));
    } catch (err) {
      next(err); // Pass the error to error handling middleware
    }
  };
  
  
  export const getByTag = async (req, res, next) => {
    const tags = req.query.tags.split(",");
    console.log(tags);
    try {
      const videos = await Video.find({ tags: { $in: tags } }).limit(20);
      res.status(200).json(videos); // Return video if found
    } catch (err) {
      next(err); // Pass the error to error handling middleware
    }
  };

  export const search = async (req, res, next) => {
    const query = req.query.q;
    try {
      const videos = await Video.find({title: { $regex: query, $options: "i" }}).limit(40);
      res.status(200).json(videos); // Return video if found
    } catch (err) {
      next(err); // Pass the error to error handling middleware
    }
  };