import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String },
  bloodGroup: { 
    type: String, 
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] 
  },
  district: { type: String, required: true },
  upazila: { type: String, required: true },
  role: { 
    type: String, 
    enum: ["donor", "volunteer", "admin"], 
    default: "donor" 
  },
  status: { 
    type: String, 
    enum: ["active", "blocked"], 
    default: "active" 
  },
}, { timestamps: true });

export default mongoose.model("User", userSchema);