const { getCollections } = require('../config/db');

exports.getAdminStats = async (req, res) => {
  try {
    const { userCollection, donationRequestCollection, paymentCollection } = getCollections();

    const totalUsers = await userCollection.countDocuments({ role: "donor" });
    const totalRequests = await donationRequestCollection.countDocuments();

    const allPaid = await paymentCollection.find({ paymentStatus: "succeeded" }).toArray();
    const totalFunding = allPaid.reduce((sum, p) => sum + p.amount, 0);

    res.json({
      totalUsers,
      totalRequests,
      totalFunding
    });
  } catch (error) {
    console.error("AdminStats Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};