const { getCollections } = require('../config/db');

const verifyAdmin = async (req, res, next) => {
  try {
    const { userCollection } = getCollections();
    const email = req.decoded_email;

    if (!email) {
      return res.status(401).json({ message: "No email found" });
    }

    const user = await userCollection.findOne({ email });
    
    if (!user || user.role !== "admin") {
      return res.status(403).json({ 
        message: "Admin access required",
        userRole: user?.role || "none"
      });
    }

    req.adminUser = user;
    next();
  } catch (error) {
    console.error("VerifyAdmin Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = verifyAdmin;