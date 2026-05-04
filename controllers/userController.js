const { ObjectId } = require('mongodb');
const { getCollections } = require('../config/db');
const bcrypt = require('bcryptjs');

exports.createUser = async (req, res) => {
  try {
    const { userCollection } = getCollections();

    let { email, name, avatar, district, upazila, bloodGroup, password } = req.body;

    email = email.toLowerCase().trim();

    const existingUser = await userCollection.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name: name.trim(),
      email,
      avatar: avatar || "",
      bloodGroup: bloodGroup || "",
      district: district || "",
      upazila: upazila || "",
      password: hashedPassword,
      role: "donor",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await userCollection.insertOne(newUser);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...newUser,
        _id: result.insertedId,
        password: undefined
      }
    });

  } catch (error) {
    console.error("CreateUser Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { userCollection } = getCollections();

    let { email, password } = req.body;
    email = email.toLowerCase().trim();

    const user = await userCollection.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.status === "blocked") {
      return res.status(403).json({ message: "Account blocked by admin" });
    }

    res.json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        avatar: user.avatar,
        bloodGroup: user.bloodGroup,
        district: user.district,
        upazila: user.upazila
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMeUser = async (req, res) => {
  try {
    const { userCollection } = getCollections();
    const email = req.user.email;

    let user = await userCollection.findOne({ email });

    if (!user) {
      return res.json({
        email,
        role: "donor",
        status: "active",
        name: req.user.name || "Donor",
        avatar: "",
        bloodGroup: "",
        district: "",
        upazila: ""
      });
    }

    res.json({
      ...user,
      _id: user._id.toString(),
      password: undefined
    });

  } catch (error) {
    console.error("getMeUser Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateOwnProfile = async (req, res) => {
  try {
    const { userCollection } = getCollections();
    const email = req.user.email;

    const { name, avatar, bloodGroup, district, upazila } = req.body;

    const updateFields = {};

    if (name?.trim()) updateFields.name = name.trim();
    if (avatar?.trim()) updateFields.avatar = avatar.trim();
    if (bloodGroup?.trim()) updateFields.bloodGroup = bloodGroup.trim();
    if (district?.trim()) updateFields.district = district.trim();
    if (upazila?.trim()) updateFields.upazila = upazila.trim();

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    await userCollection.updateOne(
      { email },
      { $set: { ...updateFields, updatedAt: new Date() } }
    );

    const updatedUser = await userCollection.findOne({ email });

    res.json({
      message: "Profile updated",
      user: {
        ...updatedUser,
        _id: updatedUser._id.toString(),
        password: undefined
      }
    });

  } catch (error) {
    console.error("UpdateProfile Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { userCollection } = getCollections();

    const { status, page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};

    if (status && status !== "all") filter.status = status;

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    const [users, total] = await Promise.all([
      userCollection.find(filter)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 })
        .toArray(),
      userCollection.countDocuments(filter)
    ]);

    res.json({
      users: users.map(u => ({
        ...u,
        password: undefined,
        _id: u._id.toString()
      })),
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error("GetAllUsers Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { userCollection } = getCollections();
    const { email } = req.params;
    const { status, role } = req.body;

    const allowedRoles = ["donor", "volunteer", "admin"];
    const allowedStatus = ["active", "blocked"];

    const updateFields = {};

    if (allowedStatus.includes(status)) {
      updateFields.status = status;
    }

    if (allowedRoles.includes(role)) {
      updateFields.role = role;
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: "Invalid update data" });
    }

    await userCollection.updateOne(
      { email },
      { $set: { ...updateFields, updatedAt: new Date() } }
    );

    const updatedUser = await userCollection.findOne({ email });

    res.json({
      message: "User updated successfully",
      user: {
        ...updatedUser,
        _id: updatedUser._id.toString(),
        password: undefined
      }
    });

  } catch (error) {
    console.error("UpdateUser Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.searchDonors = async (req, res) => {
  try {
    const { userCollection } = getCollections();
    const { bloodGroup, district, upazila, status = "active" } = req.query;

    const filter = {
      role: "donor",
      status: status
    };

    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (district) filter.district = district;
    if (upazila) filter.upazila = upazila;

    const donors = await userCollection.find(filter)
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray();

    const donorsWithoutPassword = donors.map(donor => ({
      ...donor,
      password: undefined,
      _id: donor._id.toString()
    }));

    res.json(donorsWithoutPassword);
  } catch (error) {
    console.error("SearchDonors Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};