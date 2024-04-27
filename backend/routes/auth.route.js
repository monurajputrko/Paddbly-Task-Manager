const express = require("express");
const {
  login,
  register,
  updateProfile,
} = require("../controllers/auth.controllers.js");
const { authetication } = require("../middlewares/authenticaton.js");

const authRoute = express.Router();

authRoute.post("/register", register);
authRoute.post("/login", login);
authRoute.post("/update", authetication, updateProfile);

module.exports = authRoute;
