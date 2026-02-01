import express from "express";
import Tutor from "../models/Tutor.js";
import Group from "../models/Group.js";

const router = express.Router();

/**
 * GET /home/subjects
 * Popular subjects calculated from tutors + groups
 */
router.get("/subjects", async (req, res) => {
  try {
    const tutors = await Tutor.find();
    const groups = await Group.find();

    const map = {};

    // Count tutors per module
    tutors.forEach((tutor) => {
      tutor.modules.forEach((mod) => {
        if (!map[mod]) {
          map[mod] = { code: mod, tutors: 0, groups: 0 };
        }
        map[mod].tutors += 1;
      });
    });

    // Count groups per subject
    groups.forEach((group) => {
      const sub = group.subject;
      if (!map[sub]) {
        map[sub] = { code: sub, tutors: 0, groups: 0 };
      }
      map[sub].groups += 1;
    });

    // Convert to array & sort by popularity
    const result = Object.values(map)
      .sort((a, b) => (b.tutors + b.groups) - (a.tutors + a.groups))
      .slice(0, 6); // top 6 only

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /home/groups
 * Popular  groups (latest created)
 */
router.get("/groups", async (req, res) => {
  try {
    const groups = await Group.find()
      .sort({ createdAt: -1 })
      .limit(4);

    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
