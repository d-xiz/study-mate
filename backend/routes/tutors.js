import express from "express";
import Tutor from "../models/Tutor.js";
import User from "../models/User.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tutors
 *   description: Tutor management
 */

/**
 * @swagger
 * /tutors:
 *   post:
 *     summary: Create tutor profile
 *     tags: [Tutors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - qualification
 *               - modules
 *               - days
 *               - startTime
 *               - endTime
 *             properties:
 *               userId:
 *                 type: string
 *               qualification:
 *                 type: string
 *               modules:
 *                 type: array
 *                 items:
 *                   type: string
 *               days:
 *                 type: array
 *                 items:
 *                   type: string
 *               startTime:
 *                 type: string
 *               endTime:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tutor created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Missing required fields
 */


// CREATE TUTOR
router.post("/", async (req, res) => {
  try {
    const { userId, name, qualification, modules, days, startTime, endTime} = req.body;

    if (!userId || !name || !qualification || !modules || !days || !startTime || !endTime) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existing = await Tutor.findOne({ userId });
    if (existing) {
      return res.status(409).json({ error: "Tutor already exists" });
    }

    const tutor = await Tutor.create({
      userId,
      name,
      qualification,
      modules,
      days,
      startTime,
      endTime
    });

    res.status(201).json(tutor);
  } catch (err) {
    console.error("CREATE TUTOR ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /tutors:
 *   get:
 *     summary: Get all tutors (optional filter by module)
 *     tags: [Tutors]
 *     parameters:
 *       - in: query
 *         name: module
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of tutors
 */

// GET TUTORS
router.get("/", async (req, res) => {
  try {
    const { module } = req.query;

    const query = module
      ? { modules: { $regex: module, $options: "i" } }
      : {};

    const tutors = await Tutor.find(query).populate("userId", "avatar").sort({ createdAt: -1 });
    res.json(tutors);
  } catch (err) {
    console.error("GET TUTORS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /tutors/{id}:
 *   delete:
 *     summary: Delete tutor profile
 *     tags: [Tutors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tutor deleted successfully
 *       404:
 *         description: Tutor not found
 */

// DELETE TUTOR
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Tutor.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Tutor not found" });
    }

    res.json({ message: "Tutor deleted successfully" });
  } catch (err) {
    console.error("DELETE TUTOR ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});
/**
 * @swagger
 * /tutors/{id}:
 *   put:
 *     summary: Update tutor profile
 *     tags: [Tutors]
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
 *               qualification:
 *                 type: string
 *               modules:
 *                 type: array
 *                 items:
 *                   type: string
 *               days:
 *                 type: array
 *                 items:
 *                   type: string
 *               startTime:
 *                 type: string
 *               endTime:
 *                 type: string
 *     responses:
 *       400:
 *         description: Missing required fields
 *       200:
 *         description: Tutor updated successfully
 */

// UPDATE TUTOR
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Tutor.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Tutor not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("UPDATE TUTOR ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET tutor by userId
router.get("/user/:userId", async (req, res) => {
  try {
    const tutor = await Tutor.findOne({ userId: req.params.userId });

    if (!tutor) {
      return res.status(404).json({ error: "Tutor not found" });
    }

    res.json(tutor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
