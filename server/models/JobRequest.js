const mongoose = require("mongoose"); 

const jobRequestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  Address: { type: String, required: true },
  phonenumber: { type: String },
  contactName: { type: String, required: true },
  contactEmail: {
    type: String, required: true, unique: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
  },
  status: {
    type: String, required: true,
    enum: ["Open", "In Progress", "Closed"],
    default: "Open"
  },
  createdAt: {
    type: Date, required: true,
    default: Date.now
  }
});

module.exports = mongoose.model("JobRequest", jobRequestSchema);