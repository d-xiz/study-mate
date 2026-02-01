import express from "express";
import Group from "../models/Group.js";
import User from "../models/User.js";


const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Groups
 *   description: Study group management
 */

/**
 * @swagger
 * /groups:
 *   post:
 *     summary: Create a study group
 *     tags: [Groups]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - subject
 *               - adminId
 *               - adminName
 *               - days
 *               - startTime
 *               - endTime
 *               - location
 *             properties:
 *               name:
 *                 type: string
 *               subject:
 *                 type: string
 *               adminId:
 *                 type: string
 *               adminName:
 *                 type: string
 *               days:
 *                 type: array
 *                 items:
 *                   type: string
 *               startTime:
 *                 type: string
 *               endTime:
 *                 type: string
 *               location:
 *                 type: string
 *               pax:
 *                 type: number
 *               welcomeMessage:
 *                 type: string
 *
 *     responses:
 *       201:
 *         description: Group created successfully
 *       400:
 *         description: Missing required fields
 */

// CREATE GROUP
router.post("/", async (req, res) => {
  try {
    const {
      name,
      subject,
      adminId,
      adminName,
      days,
      startTime,
      endTime,
      location,
        pax,
        welcomeMessage
    } = req.body;

    if (
      !name ||
      !subject ||
      !adminId ||
      !adminName ||
      !days ||
      !startTime ||
      !endTime ||
      !location ||
      !pax ||
      !welcomeMessage
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const group = await Group.create({
      name,
      subject,
      adminId,
      adminName,
      days,
      startTime,
      endTime,
      location,
      pax,
      availableSeats: pax,
      welcomeMessage: req.body.welcomeMessage || "",
      
    });
await User.findByIdAndUpdate(req.body.adminId, {
  $inc: { points: 10 },
});

    res.status(201).json(group);
  } catch (err) {
    console.error("CREATE GROUP ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /groups:
 *   get:
 *     summary: Get all study groups
 *     tags: [Groups]
 *     responses:
 *       200:
 *         description: List of study groups
 */

// GET  GROUPS

router.get("/", async (req, res) => {
  try {
    const { q } = req.query;

    const filter = q
      ? {
          $or: [
            { subject: { $regex: q, $options: "i" } },
            { name: { $regex: q, $options: "i" } },
          ],
        }
      : {};

    const groups = await Group.find(filter)
  .populate("members", "name adminNumber") 
  .sort({ createdAt: -1 });

    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



/**
 * @swagger
 * /groups/{id}:
 *   put:
 *     summary: Update a study group
 *     tags: [Groups]
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
 *               name:
 *                 type: string
 *               subject:
 *                 type: string
 *               days:
 *                 type: array
 *                 items:
 *                   type: string
 *               startTime:
 *                 type: string
 *               endTime:
 *                 type: string
 *               location:
 *                 type: string
  *              pax:
  *                type: number
  *              welcomeMessage:
  *                type: string
 *     responses:
 *       200:
 *         description: Group updated successfully
 *       404:
 *         description: Group not found
 */

// UPDATE GROUP
router.put("/:id", async (req, res) => {
  try {
      const { id } = req.params;

      const updateData = { ...req.body };
  if (updateData.welcomeMessage === undefined) {
    delete updateData.welcomeMessage;
  }
    const updated = await Group.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Group not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("UPDATE GROUP ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


/**
 * @swagger
 * /groups/{id}:
 *   delete:
 *     summary: Delete a group (admin only)
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Group deleted
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Group not found
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body; // simple auth for MVP

    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (group.adminId.toString() !== userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await Group.findByIdAndDelete(id);
    res.json({ message: "Group deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/:id/leave", async (req, res) => {
  const { userId } = req.body;

  const group = await Group.findById(req.params.id);
  if (!group) return res.status(404).json({ error: "Group not found" });

  group.members = group.members.filter(
    (m) => String(m) !== String(userId)
  );
  group.availableSeats += 1;

  await group.save();
  res.json(group);
});

/**
 * @swagger
 * /groups/{id}:
 *   get:
 *     summary: Get a study group by ID
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Group found
 *       404:
 *         description: Group not found
 */

router.get("/:id", async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate("members", "name adminNumber");

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    res.json(group);
  } catch (err) {
    console.error("GET GROUP BY ID ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
