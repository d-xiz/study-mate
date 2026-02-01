import cron from "node-cron";
import Session from "../models/Session.js";
import User from "../models/User.js";
import Tutor from "../models/Tutor.js";

cron.schedule("*/5 * * * *", async () => {
  console.log("🕒 Running session auto-complete job");

  const now = new Date();

  const sessions = await Session.find({
    status: "accepted",
  });

  for (const s of sessions) {
    const sessionEnd = new Date(`${s.date}T${s.endTime}`);

    if (now > sessionEnd) {
      s.status = "completed";
      await s.save();

      // Reward points
      await User.findByIdAndUpdate(s.studentId, { $inc: { points: 5 } });

      const tutor = await Tutor.findById(s.tutorId);
      if (tutor) {
        await User.findByIdAndUpdate(tutor.userId, { $inc: { points: 10 } });
      }

      console.log("✅ Session completed:", s._id);
    }
  }
});
