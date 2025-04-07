const express = require("express");
const { body } = require("express-validator");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("../controllers/authController");

const router = express.Router();

router.post(
  "/",
  [
    body("taskName").notEmpty().withMessage("Task name is required"),
    body("dueDate").notEmpty().withMessage("Due date is required"),
  ],
  createTask
);

router.post("/get", getTasks);

router.put(
  "/:id",
  [
    body("taskName").notEmpty().withMessage("Task name is required"),
    body("dueDate").notEmpty().withMessage("Due date is required"),
  ],
  updateTask
);

router.delete("/:id", deleteTask);

module.exports = router;
