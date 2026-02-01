// models/Notification.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },

    tutorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tutor",
    },

    message: String,

    sessionId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Session",
}
,

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "info"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
