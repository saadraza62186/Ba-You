import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import express from "express";
import { CreateError } from "../error.js";
import jwt from "jsonwebtoken";
const app = express();

// Middleware to parse JSON requests
app.use(express.json());
export const signup = async (req, res, next) => {
  try {
    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);

    // Create a new user with the hashed password
    const newUser = new User({ ...req.body, password: hash });

    // Save the new user to the database
    await newUser.save();

    // Send success response
    res.status(200).send("User has been created successfully");
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  try {
    // Find user by name
    const user = await User.findOne({ name: req.body.name });
    if (!user) {
      return next(CreateError(404, "User not found")); // Adjust error message
    }

    // Compare passwords
    const isCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isCorrect) {
      return next(CreateError(400, "Wrong credentials")); // Adjust error message
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT, {
      expiresIn: "1d",
    });

    // Send response with cookie
    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Secure in production
        sameSite: "None", // Prevent CSRF
      })
      .status(200)
      .json(user);
  } catch (err) {
    next(err);
  }
};

export const googleAuth = async (req, res, next) => {
  try {
    const user = await User.findOne({ googleId: req.body.googleId });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT);
      res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Secure in production
        sameSite: "None", // Prevent CSRF
      })
      .status(200)
      .json(user._doc); // Send user document as response
    }else{
      const newUser = new User({
        ...req.body,
        fromGoogle: true,
      });
      const savedUser = await newUser.save();
      const token = jwt.sign({ id: savedUser._id }, process.env.JWT);
      res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Secure in production
        sameSite: "None", // Prevent CSRF
      })
      .status(200)
      .json(savedUser._doc); 
    }
  } catch (err) {
    next(err);
  }

}