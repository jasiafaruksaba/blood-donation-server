import User from "../models/User.js";

const verifyActive = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (user && user.status === "blocked") {
      return res.status(403).json({ message: "Your account has been blocked by admin." });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export default verifyActive;