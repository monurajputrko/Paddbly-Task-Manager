const express = require("express");
const cors = require("cors");
const connection = require("./db/connection.js");
const authRoute = require("./routes/auth.route.js");
const taskRoute = require("./routes/task.route.js");
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.use("/auth", authRoute);
app.use("/task", taskRoute);

app.use(express.static(path.join(__dirname, './client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/build/index.html'))
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.use("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the Task Management API",
  });
});

app.listen(PORT, () => {
  connection();
  console.log(`Listening on port ${PORT}`);
});
