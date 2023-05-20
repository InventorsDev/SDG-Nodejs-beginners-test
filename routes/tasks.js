const express = require("express");
const router = express.Router();
const Task = require("../models/task");

//retrieve all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
});

//create task
router.post("/", async (req, res) => {
  try {
    const task = await Task.create(req.body);

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
});

//get task
router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).send("Task not found");
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
});

//update task
router.patch("/:id", async (req, res) => {
  try {
    const update = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!update) return res.status(404).send("Task not found");
    res.status(200).json(update);
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
});

//delete task
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).send({
        message: "Task not found",
      });
    }
    res.status(204).send({});
  } catch (err) {
    return res.status(500).send({
      status: "error",
      message: "Something went wrong",
    });
  }
});

// Mark task as aompleted
router.patch("/:id/completed", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status: "completed" },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!task) return res.status(404).send("Task not found");
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
});

module.exports = router;
