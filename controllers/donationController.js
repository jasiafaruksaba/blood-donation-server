const { ObjectId } = require('mongodb');
const { getCollections } = require('../config/db');

exports.createDonationRequest = async (req, res) => {
  try {
    const { donationRequestCollection } = getCollections();
    const email = req.user.email;

    // 🔒 BLOCK CHECK
    if (req.userData?.status === "blocked") {
      return res.status(403).json({ message: "Blocked user cannot create request" });
    }

    const donationRequest = {
      requesterEmail: email,
      recipientName: req.body.recipientName,
      recipientDistrict: req.body.recipientDistrict,
      recipientUpazila: req.body.recipientUpazila,
      hospital: req.body.hospital,
      fullAddress: req.body.fullAddress,
      bloodGroup: req.body.bloodGroup,
      donationDate: req.body.donationDate,
      donationTime: req.body.donationTime,
      message: req.body.message,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await donationRequestCollection.insertOne(donationRequest);

    res.status(201).json({
      success: true,
      message: 'Donation request created successfully',
      id: result.insertedId
    });

  } catch (error) {
    console.error('CreateDonationRequest Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMyRequests = async (req, res) => {
  try {
    const { donationRequestCollection } = getCollections();
    const email = req.params.email;
    const { page = 1, limit = 10, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = { requesterEmail: email };
    if (status && status !== "all") filter.status = status;

    const [requests, total] = await Promise.all([
      donationRequestCollection.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .toArray(),
      donationRequestCollection.countDocuments(filter)
    ]);

    res.json({
      requests: requests.map(r => ({ ...r, _id: r._id.toString() })),
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error("GetMyRequests Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const { donationRequestCollection } = getCollections();
    const { page = 1, limit = 10, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = status && status !== "all" ? { status } : {};

    // Only show pending requests on public page
    if (req.query.public) {
      filter.status = "pending";
    }

    const [requests, total] = await Promise.all([
      donationRequestCollection.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .toArray(),
      donationRequestCollection.countDocuments(filter)
    ]);

    res.json({
      requests: requests.map(r => ({ ...r, _id: r._id.toString() })),
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error("GetAllRequests Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getRequestById = async (req, res) => {
  try {
    const { donationRequestCollection } = getCollections();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const request = await donationRequestCollection.findOne({ _id: new ObjectId(id) });
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json({ ...request, _id: request._id.toString() });
  } catch (error) {
    console.error("GetRequestById Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateRequest = async (req, res) => {
  try {
    const { donationRequestCollection } = getCollections();
    const { id } = req.params;
    const email = req.user.email;

    const existing = await donationRequestCollection.findOne({ _id: new ObjectId(id) });

    // 🔐 OWNER CHECK
    if (!existing || existing.requesterEmail !== email) {
      return res.status(403).json({ message: "Forbidden: Not your request" });
    }

    const updateFields = req.body;

    const result = await donationRequestCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateFields, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Request not found" });
    }

    const updatedRequest = await donationRequestCollection.findOne({ _id: new ObjectId(id) });

    res.json({
      message: "Request updated successfully",
      request: { ...updatedRequest, _id: updatedRequest._id.toString() }
    });

  } catch (error) {
    console.error("UpdateRequest Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



exports.deleteRequest = async (req, res) => {
  try {
    const { donationRequestCollection } = getCollections();
    const { id } = req.params;
    const email = req.user.email;

    const existing = await donationRequestCollection.findOne({ _id: new ObjectId(id) });

    // 🔐 OWNER CHECK
    if (!existing || existing.requesterEmail !== email) {
      return res.status(403).json({ message: "Forbidden: Not your request" });
    }

    const result = await donationRequestCollection.deleteOne({ _id: new ObjectId(id) });

    res.json({ message: "Request deleted successfully" });
  } catch (error) {
    console.error("DeleteRequest Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const { donationRequestCollection } = getCollections();
    const { id } = req.params;
    const { status } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const validStatus = ["pending", "inprogress", "done", "cancelled"];
    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const result = await donationRequestCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json({ message: "Status updated successfully" });

  } catch (error) {
    console.error("UpdateStatus Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};