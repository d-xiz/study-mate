import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  adminNumber: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "student", 
  },
    about: {
      type: String,

    },
  course: { 
    type: String 
  },
  strongModules: [String],
  helpModules: [String],
  avatar: {
  type: String,//base64 string
  default: "",
},
points: {
  type: Number,
  default: 0
}
,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("User", userSchema);
