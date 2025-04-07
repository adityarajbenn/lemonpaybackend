// backend/controllers/taskController.js

const { validationResult } = require("express-validator");
const Task = require("../models/Task");

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
