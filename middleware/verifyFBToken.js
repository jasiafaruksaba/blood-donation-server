const admin = require('../config/firebase');

const verifyFBToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized access - No token' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log('🔓 Token verified:', decodedToken.email);
    
    req.decoded_email = decodedToken.email;
    req.user = decodedToken;
    
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    res.status(401).json({ message: 'Unauthorized access - Invalid token' });
  }
};

module.exports = verifyFBToken;