const { getCollections } = require('../config/db');

const verifyActive = async (req, res, next) => {
  try {
    const { userCollection } = getCollections();
    
    // ✅ FIXED: req.user.email ব্যবহার করুন (verifyFBToken থেকে আসে)
    const email = req.user?.email;

    if (!email) {
      return res.status(401).json({ message: "No user email found" });
    }

    const user = await userCollection.findOne({ email });
    
    // ✅ User না থাকলে default allow করুন (new Firebase user)
    if (!user) {
      console.log(`👤 New user allowed: ${email}`);
      req.userData = { email, role: 'donor', status: 'active' };
      return next();
    }
    
    if (user.status === "blocked") {
      return res.status(403).json({ 
        message: "Account blocked by admin. Contact support." 
      });
    }

    req.userData = { ...user, password: undefined };
    next();
  } catch (error) {
    console.error("VerifyActive Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = verifyActive;