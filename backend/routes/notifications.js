import express from "express";
import Notification from "../models/Notification.js";
import Group from "../models/Group.js";
import mongoose from "mongoose";
import Session from "../models/Session.js";
import User from "../models/User.js";
import Tutor from "../models/Tutor.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Join and tutor requests
 */

/**
 * @swagger
 * /notifications:
 *   post:
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - senderId
 *               - receiverId
 *             properties:
 *               type:
 *                 type: string
 *               senderId:
 *                 type: string
 *               receiverId:
 *                 type: string
 *               groupId:
 *                 type: string
 *               tutorId:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
router.post("/", async (req, res) => {
  try {
    const {
      type,
      senderId,
      receiverId,
      groupId,
      tutorId,
      message,
    } = req.body;

    const notification = await Notification.create({
      type,
      senderId,
      receiverId,
      groupId,
      tutorId,
      message,
    });

    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /notifications/{userId}:
 *   get:
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/:userId", async (req, res) => {
  try {
    const notifications = await Notification.find({
      receiverId: req.params.userId,
    })
      .populate("senderId", "name")
      .populate("groupId", "name")
      .populate("tutorId", "name")
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /notifications/{id}:
 *   patch:
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 */
router.patch("/:id", async (req, res) => {
  try {
    

    const { status } = req.body;
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    // --- LOGIC FOR GROUP JOIN REQUESTS ---
    if (status === "accepted" && notification.groupId) {
      const group = await Group.findById(notification.groupId);

      if (!group) {
        return res.status(404).json({ error: "Group not found" });
      }

      // Initialize availableSeats if not defined
      if (group.availableSeats === undefined) {
        group.availableSeats = group.pax;
      }

      // Validate member status and seat availability
      if (group.members.includes(notification.senderId)) {
        return res.status(400).json({ error: "Already joined" });
      }

      if (group.availableSeats <= 0) {
        return res.status(400).json({ error: "No seats available" });
      }

      // Update Group members and seats
      group.members.push(notification.senderId);
      group.availableSeats -= 1;
      await group.save();

      // Update User Points
      await User.findByIdAndUpdate(notification.senderId, { $inc: { points: 5 } });
      await User.findByIdAndUpdate(notification.receiverId, { $inc: { points: 10 } });
    }

    // --- LOGIC FOR TUTOR SESSION BOOKINGS ---
    if (notification.sessionId && notification.type.startsWith("tutor_booking")) {
      const session = await Session.findById(notification.sessionId);

      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      // Prevent processing a session that is no longer pending
      if (session.status !== "pending") {
        return res.status(400).json({ error: "Session already processed" });
      }
      if (status === "accepted") {
     // Student
      await User.findByIdAndUpdate(session.studentId, {
        $inc: { points: 5 },
      });

      // Tutor
      const tutor = await Tutor.findById(session.tutorId);
if (!tutor) {
  console.error("Tutor not found for session:", session._id);
} else {
  await User.findByIdAndUpdate(tutor.userId, {
    $inc: { points: 10 },
  });
}

    }


      session.status = status;
      await session.save();
    }

    // --- UPDATE CURRENT NOTIFICATION STATUS ---
    notification.status = status;
    await notification.save();

    let callbackMessage = "Your request has been processed.";


if (notification.groupId) {
  // GROUP JOIN
  const group = await Group.findById(notification.groupId);

  callbackMessage =
    status === "accepted" && group?.welcomeMessage
      ? group.welcomeMessage
      : status === "accepted"
      ? "Your request was accepted"
      : "Your request was rejected";
} else if (notification.sessionId) {
   const session = await Session.findById(notification.sessionId);
  // TUTOR SESSION
  callbackMessage =
    status === "accepted"
      ? `Your tutoring session is confirmed.
      Date: ${session.date}
      Time: ${session.startTime}–${session.endTime}
      Module: ${session.module}`
      : "Your tutoring session was rejected";
      }

    // --- CREATE CALLBACK NOTIFICATION FOR THE SENDER ---
    await Notification.create({
      type: `${notification.type}_${status}`,
      senderId: notification.receiverId,
      receiverId: notification.senderId,
      groupId: notification.groupId,
      tutorId: notification.tutorId,
      status: "info",
      message: callbackMessage,
    });

    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
