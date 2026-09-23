const mongoose = require("mongoose");
const User = require("../models/User");
const Task = require("../models/Task");

async function me(req, res) {
  const user = await User.findById(req.user.id)
    .select("_id name email role createdAt")
    .lean();
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ id: user._id.toString(), name: user.name, email: user.email, role: user.role, createdAt: user.createdAt });
}

async function getUsers(req, res) {
  const users = await User.find()
    .select("_id name email role createdAt")
    .sort({ createdAt: -1 })
    .lean();
  res.json(users.map(user => ({
    id: user._id.toString(), name: user.name, email: user.email, role: user.role, createdAt: user.createdAt
  })));
}

async function deleteUser(req, res) {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid user id" });
  if (id === req.user.id) return res.status(400).json({ message: "You cannot delete yourself" });

  const existing = await User.findById(id);
  if (!existing) return res.status(404).json({ message: "User not found" });

  await Task.deleteMany({ userId: existing._id });
  await User.findByIdAndDelete(existing._id);
  res.json({ message: "User deleted" });
}

async function createAdmin(req, res) {
  const { email } = req.body;
  if (!email?.trim()) return res.status(400).json({ message: "Email is required" });

  const user = await User.findOneAndUpdate(
    { email: email.trim().toLowerCase() },
    { role: "admin" },
    { new: true }
  ).select("_id name email role");

  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({
    message: "User promoted to admin",
    user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role }
  });
}

module.exports = { me, getUsers, deleteUser, createAdmin };
