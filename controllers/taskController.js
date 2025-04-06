const { validationResult } = require("express-validator");
const Task = require("../models/Task");

// GET all tasks
exports.getTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user }).sort({ createdAt: -1 });
  res.json(tasks);
};

// CREATE task
exports.createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { taskName, description, dueDate } = req.body;

  const task = new Task({
    user: req.user,
    taskName,
    description,
    dueDate,
  });

  await task.save();
  res.status(201).json(task);
};

// UPDATE task
exports.updateTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { taskName, description, dueDate } = req.body;

  const updated = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user },
    { taskName, description, dueDate },
    { new: true }
  );

  if (!updated) return res.status(404).json({ msg: "Task not found" });
  res.json(updated);
};

// DELETE task
exports.deleteTask = async (req, res) => {
  const deleted = await Task.findOneAndDelete({ _id: req.params.id, user: req.user });
  if (!deleted) return res.status(404).json({ msg: "Task not found" });
  res.json({ msg: "Task deleted" });
};
