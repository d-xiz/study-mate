import express from "express";
import User from "../models/User.js";
import Group from "../models/Group.js";
import Tutor from "../models/Tutor.js";
import Session from "../models/Session.js";


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User authentication
 */
const router = express.Router();


/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - adminNumber
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               adminNumber:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       409:
 *         description: User already exists
 */

// SIGN UP
router.post("/signup", async (req, res) => {
  try {
    const { name, adminNumber, password,role} = req.body;

    if (!name || !adminNumber || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const existing = await User.findOne({ adminNumber });
    if (existing) {
      return res.status(409).json({ error: "User already exists" });
    }

    const user = await User.create({
      name,
      adminNumber,
      password,
      role,
    });

    res.status(201).json({
      id: user.id,
      name: user.name,
      adminNumber: user.adminNumber,
      role: user.role,
    });
  } catch (err) {
  console.error("SIGNUP ERROR:", err);

  // Duplicate admission number
  if (err.code === 11000) {
    return res.status(409).json({
      error: "Admission number already exists",
    });
  }

  res.status(500).json({ error: err.message });
}
});

/**
 * @swagger
 * /users/{id}/profile:
 *   put:
 *     summary: Complete or update user profile information
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               about:
 *                 type: string
 *                
 *               course:
 *                 type: string
 *                
 *               strongModules:
 *                 type: array
 *                 items:
 *                   type: string
 *                
 *               helpModules:
 *                 type: array
 *                 items:
 *                   type: string
 *                 
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 adminNumber:
 *                   type: string
 *                 about:
 *                   type: string
 *                 course:
 *                   type: string
 *                 strongModules:
 *                   type: array
 *                   items:
 *                     type: string
 *                 helpModules:
 *                   type: array
 *                   items:
 *                     type: string
 *       404:
 *         description: User not found
 *       400:
 *         description: Invalid request
 */

router.put("/:id/profile", async (req, res) => {
  try {
    const { about, course, strongModules, helpModules, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { about, course, strongModules, helpModules, avatar },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - adminNumber
 *               - password
 *             properties:
 *               adminNumber:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */


// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { adminNumber, password } = req.body;

    const user = await User.findOne({ adminNumber, password });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({
      id: user.id,
      name: user.name,
      adminNumber: user.adminNumber,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
/**
 * @swagger
 * /users/{id}/role:
 *   patch:
 *     summary: Update user role
 *     tags: [Users]
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
 *             properties:
 *               role:
 *                 type: string
 *                 example: tutor
 *     responses:
 *       200:
 *         description: Role updated
 */
router.patch("/:id/role", async (req, res) => {
  try {
    const { role } = req.body;

    if (!["student", "tutor"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id/gamification", async (req, res) => {
  const userId = req.params.id;

  const groupsCreated = await Group.countDocuments({ adminId: userId });
  const groupsJoined = await Group.countDocuments({ members: userId });

  const tutor = await Tutor.findOne({ userId });
  const tutorSessions = tutor
    ? await Session.countDocuments({
        tutorId: tutor._id,
        status: "accepted",
      })
    : 0;

  const user = await User.findById(userId);

  const badges = [];

  if (groupsJoined >= 1) badges.push("First Step ");
  if (groupsJoined >= 3) badges.push("Team Player");

  if (groupsCreated >= 1) badges.push("Group Leader");
  if (groupsCreated >= 3) badges.push("Community Builder");

  if (tutorSessions >= 2) badges.push("Helpful Tutor");
  if (tutorSessions >= 5) badges.push("Star Tutor");
  if (tutorSessions >= 10) badges.push("Expert Tutor");

  if (user.points >= 50) badges.push("Rising Star");
  if (user.points >= 100) badges.push("Master");
  if (user.points >= 150) badges.push("Grand Master");

  res.json({
    points: user.points,
    badges,
    stats: {
      groupsCreated,
      groupsJoined,
      tutorSessions,
    },
  });
});


export default router;
