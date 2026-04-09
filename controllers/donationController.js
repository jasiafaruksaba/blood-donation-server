import DonationRequest from "../models/DonationRequest.js";

// Create New Donation Request
export const createDonationRequest = async (req, res) => {
  try {
    const newRequest = new DonationRequest(req.body);
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get My Donation Requests (Donor)
export const getMyRequests = async (req, res) => {
  const requests = await DonationRequest.find({ 
    requesterEmail: req.params.email 
  }).sort({ createdAt: -1 });
  res.json(requests);
};

// Get All Donation Requests (Admin & Volunteer)
export const getAllRequests = async (req, res) => {
  const requests = await DonationRequest.find().sort({ createdAt: -1 });
  res.json(requests);
};

// Update Request Status (Pending → Inprogress, Done, Canceled)
export const updateRequestStatus = async (req, res) => {
  const { status, donorName, donorEmail } = req.body;

  const updated = await DonationRequest.findByIdAndUpdate(
    req.params.id,
    { 
      status, 
      donorName, 
      donorEmail 
    },
    { new: true }
  );

  if (!updated) return res.status(404).json({ message: "Request not found" });
  res.json(updated);
};

// Delete Donation Request
export const deleteRequest = async (req, res) => {
  await DonationRequest.findByIdAndDelete(req.params.id);
  res.json({ message: "Donation request deleted successfully" });
};