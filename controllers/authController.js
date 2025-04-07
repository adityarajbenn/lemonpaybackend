const { validationResult } = require("express-validator");
const User = require("../models/User");
const Task = require("../models/Task");

// User Registration
exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    user = new User({ email, password });
    await user.save();

    res.status(201).json({ userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// User Login
exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) return res.status(400).json({ msg: "Invalid credentials" });

    res.json({ userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Create Task
exports.createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { taskName, description, dueDate, userId } = req.body;

  try {
    const newTask = new Task({ taskName, description, dueDate, user: userId });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get Tasks
exports.getTasks = async (req, res) => {
  const { userId } = req.body;

  try {
    const tasks = await Task.find({ user: userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Update Task
exports.updateTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { taskName, description, dueDate, userId } = req.body;
  const taskId = req.params.id;

  try {
    const task = await Task.findOneAndUpdate(
      { _id: taskId, user: userId },
      { taskName, description, dueDate },
      { new: true }
    );

    if (!task) return res.status(404).json({ msg: "Task not found" });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Delete Task
exports.deleteTask = async (req, res) => {
  const { userId } = req.body;
  const taskId = req.params.id;

  try {
    const task = await Task.findOneAndDelete({ _id: taskId, user: userId });
    if (!task) return res.status(404).json({ msg: "Task not found" });
    res.json({ msg: "Task deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
