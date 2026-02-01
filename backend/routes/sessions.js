import express from "express";
import Session from "../models/Session.js";
import Notification from "../models/Notification.js";
import Tutor from "../models/Tutor.js";
import User from "../models/User.js";


const router = express.Router();

// Student books a session
router.post("/", async (req, res) => {
  try {
    const { tutorId, studentId, date, startTime, endTime } = req.body;

    // prevent duplicate booking
    const existing = await Session.findOne({
      tutorId,
      date,
      startTime,
      status: { $in: ["pending", "accepted"] },
    });

    if (existing) {
      return res.status(409).json({ error: "Slot already booked" });
    }

    const session = await Session.create({
      tutorId,
      studentId,
      date,
      startTime,
      endTime,
      status: "pending",
      stu_message: req.body.stu_message,
      module: req.body.module,
    });
const tutor = await Tutor.findById(tutorId);
if (!tutor) {
  return res.status(404).json({ error: "Tutor not found" });
}
    // notify tutor
    await Notification.create({
      type: "tutor_booking",
      senderId: studentId,
      receiverId: tutor.userId,
      tutorId: tutor._id,
      sessionId: session._id,
      message: "New tutoring session request",
      status: "pending",
    });

    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/tutor/:userId/count", async (req, res) => {
  try {
    const tutor = await Tutor.findOne({ userId: req.params.userId });
    if (!tutor) {
      return res.json({ count: 0 });
    }

    const count = await Session.countDocuments({
      tutorId: tutor._id,
      status: "accepted", 
    });

    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// GET sessions for student
router.get("/student/:userId", async (req, res) => {
  try {
    const sessions = await Session.find({
      studentId: req.params.userId,
      status: { $in: ["pending", "accepted"] },
    })
      .populate("tutorId", "userId")
      .sort({ date: 1, startTime: 1 });

    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// GET sessions for tutor
router.get("/tutor/:tutorId", async (req, res) => {
  try {
    const sessions = await Session.find({
      tutorId: req.params.tutorId,
      status: "accepted",
    })
      .populate("studentId", "name")
      .sort({ date: 1, startTime: 1 });

    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Tutor cancels an accepted session
router.patch("/:id/cancel", async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    if (session.status !== "accepted") {
      return res.status(400).json({ error: "Only accepted sessions can be cancelled" });
    }

    session.status = "cancelled";
    await session.save();

    // Student loses points
    await User.findByIdAndUpdate(session.studentId, {
      $inc: { points: -5 },
    });

    // Tutor loses points (SAFE)
    const tutor = await Tutor.findById(session.tutorId);

    if (tutor) {
      await User.findByIdAndUpdate(tutor.userId, {
        $inc: { points: -10 },
      });
    } else {
      console.warn("Tutor not found for session:", session._id);
    }

    // Notify student
    await Notification.create({
      type: "tutor_booking_cancelled",
      senderId: tutor?.userId,
      receiverId: session.studentId,
      tutorId: session.tutorId,
      sessionId: session._id,
      status: "info",
      message: "Your tutoring session was cancelled by the tutor",
    });

    res.json({ success: true });
  } catch (err) {
    console.error("CANCEL SESSION ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


export default router;
