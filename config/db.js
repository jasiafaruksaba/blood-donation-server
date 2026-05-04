const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.byjw6cl.mongodb.net/blood_donation?retryWrites=true&w=majority`;

const client = new MongoClient(uri);

let db;

const connectDB = async () => {
  try {
    await client.connect({
      serverSelectionTimeoutMS: 10000,   
      socketTimeoutMS: 45000,
    });
    console.log(" REAL MongoDB Connected! 🎉");
    
    db = client.db("blood_donation");
    
    global.dbCollections = {
      userCollection: db.collection("users"),
      donationRequestCollection: db.collection("donationRequests"),
      paymentCollection: db.collection("payments")
    };
    
    return db;
  } catch (error) {
    console.error(" MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

const getCollections = () => global.dbCollections;

module.exports = { connectDB, getCollections };