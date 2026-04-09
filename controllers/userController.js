import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Generate JWT Token
export const createJWT = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const token = jwt.sign(
    { email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token });
};

// Get All Users (Admin only)
export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-__v");
  res.json(users);
};

// Get Single User by Email
export const getUserByEmail = async (req, res) => {
  const user = await User.findOne({ email: req.params.email });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

// Update User (Block/Unblock, Change Role)
export const updateUser = async (req, res) => {
  const { status, role } = req.body;
  const updatedUser = await User.findOneAndUpdate(
    { email: req.params.email },
    { $set: { status, role } },
    { new: true }
  );

  if (!updatedUser) return res.status(404).json({ message: "User not found" });
  res.json(updatedUser);
};

// Search Donors (Public)
export const searchDonors = async (req, res) => {
  const { blood, district, upazila } = req.query;

  const query = { role: "donor", status: "active" };

  if (blood) query.bloodGroup = blood;
  if (district) query.district = district;
  if (upazila) query.upazila = upazila;

  const donors = await User.find(query).select("name email avatar bloodGroup district upazila");
  res.json(donors);
};