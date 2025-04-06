const express = require("express");
const { body } = require("express-validator");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// All routes below are protected
router.use(auth);

// GET all tasks for logged-in user
router.get("/", getTasks);

// POST create task
router.post(
  "/",
  [
    body("taskName").notEmpty().withMessage("Task name is required"),
    body("dueDate").notEmpty().withMessage("Due date is required"),
  ],
  createTask
);

// PUT update task
router.put(
  "/:id",
  [
    body("taskName").notEmpty().withMessage("Task name is required"),
    body("dueDate").notEmpty().withMessage("Due date is required"),
  ],
  updateTask
);

// DELETE a task
router.delete("/:id", deleteTask);

module.exports = router;
