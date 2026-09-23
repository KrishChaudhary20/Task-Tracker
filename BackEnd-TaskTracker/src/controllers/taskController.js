const mongoose = require("mongoose");
const Task = require("../models/Task");

const allowedStatuses = ["pending", "completed"];

function validId(id) {
  return mongoose.isValidObjectId(id);
}

async function createTask(req, res) {
  try {
    const { title, description, status } = req.body;
    if (!title?.trim()) return res.status(400).json({ message: "Title is required" });
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Status must be pending or completed" });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description?.trim() || null,
      status: status || "pending",
      userId: req.user.id
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function getTasks(req, res) {
  try {
    const filter = req.user.role === "admin" ? {} : { userId: req.user.id };
    const tasks = await Task.find(filter)
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .lean();

    const result = tasks.map(task => ({
      ...task,
      id: task._id.toString(),
      user: task.userId ? {
        id: task.userId._id.toString(),
        name: task.userId.name,
        email: task.userId.email
      } : null,
      userId: task.userId?._id.toString()
    }));
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function updateTask(req, res) {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    if (!validId(id)) return res.status(400).json({ message: "Invalid task id" });
    if (!title?.trim()) return res.status(400).json({ message: "Title is required" });
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Status must be pending or completed" });
    }

    const existing = await Task.findById(id);
    if (!existing) return res.status(404).json({ message: "Task not found" });

    if (req.user.role !== "admin" && existing.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only modify your own tasks" });
    }

    existing.title = title.trim();
    existing.description = description?.trim() || null;
    existing.status = status || existing.status;
    await existing.save();

    res.json(existing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function deleteTask(req, res) {
  try {
    const { id } = req.params;
    if (!validId(id)) return res.status(400).json({ message: "Invalid task id" });

    const existing = await Task.findById(id);
    if (!existing) return res.status(404).json({ message: "Task not found" });

    if (req.user.role !== "admin" && existing.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own tasks" });
    }

    await Task.findByIdAndDelete(id);
    res.json({ message: "Task deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { createTask, getTasks, updateTask, deleteTask };
