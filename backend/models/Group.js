import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    adminName: {
      type: String,
      required: true,
    },
    days: {
      type: [String],
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    pax: {
      type: Number,
      default: 1,
    },
    availableSeats: {
  type: Number,
  required: true,
},
welcomeMessage: {
  type: String,
  default: "",
},
members: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }
],



  },
  { timestamps: true }
);

export default mongoose.model("Group", groupSchema);
