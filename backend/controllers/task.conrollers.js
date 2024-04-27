const Task = require("../models/task.model.js");
const User = require("../models/user.model.js");

exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate , priority, status } = req.body;
    const newTask = new Task({
      title,
      description,
      priority,
      dueDate,
      status,
      creator: req.userId,
    });
    await newTask.save();

    const user = await User.findById(req.userId);
    user.tasks.push(newTask);
    user.save();
    return res.status(200).json({ msg: "Task created", newTask });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getUserTasks = async (req, res) => {
  try {
    let filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.priority) {
      filter.priority = req.query.priority;
    }

    const page = req.query.page || 1;
    const limit = 3;

    const skip = (page - 1) * limit;

    const user = await User.findById(req.userId).populate({
      path: "tasks",
      match: filter,
      options: { skip, limit },
    });

    const tasks = user.tasks;

    return res.status(200).json({ tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { status, taskId } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (task.creator != req.userId) {
      return res
        .status(500)
        .json({ error: "You are not authorized to update this task!" });
    }

    task.status = status;
    await task.save();

    return res.status(200).json({ msg: "Task Status Updated", task });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteATask = async (req, res) => {
  try {
    const { taskId } = req.body;

    const task = await Task.findByIdAndDelete(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (task.creator != req.userId) {
      return res
        .status(500)
        .json({ error: "You are not authorized to delete this task!" });
    }

    return res.status(200).json({ msg: "Task Status Deleted", taskId });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getTasksCount = async (req, res) => {
  try {
    let filter = {};
    if (req.query.priority) {
      filter.priority = req.query.priority;
    }
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const userTasks = await User.findById(req.userId).populate("tasks");

    const allTasksCount = userTasks.tasks.length;
    const pendingTasksCount = userTasks.tasks.filter(
      (task) => task.status === "pending"
    ).length;
    const inProgressTasksCount = userTasks.tasks.filter(
      (task) => task.status === "in progress"
    ).length;
    const completedTasksCount = userTasks.tasks.filter(
      (task) => task.status === "completed"
    ).length;

    let queriedTaskCount = 0;
    if (req.query.priority && req.query.status) {
      queriedTaskCount = userTasks.tasks.filter(
        (task) =>
          task.priority === req.query.priority &&
          task.status === req.query.status
      ).length;
    } else if (req.query.priority) {
      queriedTaskCount = userTasks.tasks.filter(
        (task) => task.priority === req.query.priority
      ).length;
    } else if (req.query.status) {
      queriedTaskCount = userTasks.tasks.filter(
        (task) => task.status === req.query.status
      ).length;
    }

    return res.status(200).json({
      queriedTaskCount,
      allTasksCount,
      pendingTasksCount,
      inProgressTasksCount,
      completedTasksCount,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { taskId, title, description, priority } = req.body;

    const taskToUpdate = await Task.findById(taskId);
    if (!taskToUpdate) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (taskToUpdate.creator != req.userId) {
      return res
        .status(500)
        .json({ error: "You are not authorized to delete this task!" });
    }

    const task = await Task.findByIdAndUpdate(
      taskId,
      { title, description, priority },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    await task.save();

    return res.status(200).json({ msg: "Task updated successfully", task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
