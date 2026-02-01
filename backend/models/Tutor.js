import mongoose from "mongoose";

const tutorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    qualification: {
      type: String,
      required: true,
    },
    modules: {
      type: [String],
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
    },
  { timestamps: true }
);

export default mongoose.model("Tutor", tutorSchema);
