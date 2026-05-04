const { getCollections } = require('../config/db');

const verifyVolunteer = async (req, res, next) => {
  try {
    const { userCollection } = getCollections();
    const email = req.decoded_email;

    if (!email) {
      return res.status(401).json({ message: "No email found" });
    }

    const user = await userCollection.findOne({ email });
    
    if (!user || !["admin", "volunteer"].includes(user.role)) {
      return res.status(403).json({ 
        message: "Volunteer/Admin access required",
        userRole: user?.role || "none"
      });
    }

    req.volunteerUser = user;
    next();
  } catch (error) {
    console.error("VerifyVolunteer Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = verifyVolunteer;