import mongoose from "mongoose";

const donationRequestSchema = new mongoose.Schema({
  requesterName: { type: String, required: true },
  requesterEmail: { type: String, required: true },
  recipientName: { type: String, required: true },
  recipientDistrict: { type: String, required: true },
  recipientUpazila: { type: String, required: true },
  hospital: { type: String, required: true },
  fullAddress: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  donationDate: { type: String, required: true },
  donationTime: { type: String, required: true },
  message: { type: String },
  status: { 
    type: String, 
    enum: ["pending", "inprogress", "done", "canceled"], 
    default: "pending" 
  },
  donorName: String,
  donorEmail: String,
}, { timestamps: true });

export default mongoose.model("DonationRequest", donationRequestSchema);