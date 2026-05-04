const admin = require("firebase-admin");


const serviceAccount = require('../blood-donation-firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

console.log("🔥 Firebase Admin Initialized!");

module.exports = admin;