const express = require("express");
const {
  createTask,
  deleteATask,
  getTasksCount,
  getUserTasks,
  updateTask,
  updateTaskStatus,
} = require("../controllers/task.conrollers.js");
const { authetication } = require("../middlewares/authenticaton.js");

const taskRoute = express.Router();

taskRoute.post("/create", authetication, createTask);
taskRoute.get("/count", authetication, getTasksCount);
taskRoute.get("/get", authetication, getUserTasks);
taskRoute.post("/update", authetication, updateTask);
taskRoute.post("/updateStatus", authetication, updateTaskStatus);
taskRoute.post("/deleteTask", authetication, deleteATask);

module.exports = taskRoute;
