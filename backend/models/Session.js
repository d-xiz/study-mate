import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    tutorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tutor",
      required: true,
      index: true,
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    date: {
      type: String, // YYYY-MM-DD
      required: true,
      index: true,
    },

    startTime: {
      type: String, // HH:mm
      required: true,
    },

    endTime: {
      type: String, // HH:mm
      required: true,
    },

    module: {
      type: String,
      required: true,
    },

    stu_message: {
      type: String,
      default: "",
    },


    status: {
      type: String,
      enum: ["pending", "accepted", "rejected","cancelled", "completed"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true }
);

// Prevent double booking of accepted sessions
sessionSchema.index(
  { tutorId: 1, date: 1, startTime: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "accepted" },
  }
);

export default mongoose.model("Session", sessionSchema);
