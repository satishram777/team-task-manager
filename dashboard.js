const express = require("express");
const Task = require("../models/task");
const Project = require("../models/project");
const auth = require("../middleware/authMiddleware");
const User = require("../models/user");

const router = express.Router();

// Dashboard summary for user
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // User's projects
    const projects = await Project.find({
      $or: [{ owner: userId }, { members: userId }]
    }).populate('owner', 'name');

    // Tasks stats
    const tasksQuery = {
      $or: [
        { assignee: userId },
        { project: { $in: await getUserProjectsIds(userId) } }
      ]
    };

    const totalTasks = await Task.countDocuments(tasksQuery);
    const overdueTasks = await Task.countDocuments({
      ...tasksQuery,
      dueDate: { $lt: new Date() },
      status: { $ne: 'done' }
    });
    const tasksByStatus = await Task.aggregate([
      { $match: tasksQuery },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      projects: projects.length,
      totalTasks,
      overdueTasks,
      tasksByStatus: Object.fromEntries(
        tasksByStatus.map(s => [s._id, s.count])
      )
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function getUserProjectsIds(userId) {
  const projects = await Project.find({
    $or: [{ owner: userId }, { members: userId }]
  });
  return projects.map(p => p._id);
}

module.exports = router;

