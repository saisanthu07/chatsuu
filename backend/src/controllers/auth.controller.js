import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullName, email, username, password } = req.body;
  try {
    if (!fullName || !email || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ message: "Invalid email format" });
    if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });
    const usernameRegex = /^[a-z0-9_]{3,30}$/;
    if (!usernameRegex.test(username.toLowerCase())) {
      return res.status(400).json({ message: "Username must be 3-30 characters: letters, numbers, underscores only" });
    }

    if (await User.findOne({ email })) return res.status(400).json({ message: "Email already in use" });
    if (await User.findOne({ username: username.toLowerCase() })) return res.status(400).json({ message: "Username already taken" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ fullName, email, username: username.toLowerCase(), password: hashedPassword });
    await newUser.save();
    generateToken(newUser._id, res);

    res.status(201).json({
      _id: newUser._id, fullName: newUser.fullName, email: newUser.email,
      username: newUser.username, profilePic: newUser.profilePic, bio: newUser.bio,
    });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { identifier, password } = req.body;
  try {
    if (!identifier || !password) return res.status(400).json({ message: "All fields are required" });

    // Allow login with email OR username
    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase() }, { username: identifier.toLowerCase() }],
    });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    if (!(await bcrypt.compare(password, user.password))) return res.status(400).json({ message: "Invalid credentials" });

    // Update lastSeen
    user.lastSeen = new Date();
    await user.save();

    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id, fullName: user.fullName, email: user.email,
      username: user.username, profilePic: user.profilePic, bio: user.bio,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;
    const userId = req.user._id;

    const updates = {};
    if (bio !== undefined) updates.bio = bio;
    if (fullName) updates.fullName = fullName;
    if (profilePic) {
      const uploadResponse = await cloudinary.uploader.upload(profilePic);
      updates.profilePic = uploadResponse.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true }).select("-password");
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
