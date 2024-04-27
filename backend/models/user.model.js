const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = mongoose.Schema(
  {
    fullname: {
      type: String,
      lowercase: true,
      required: true,
      minlength: [3, "fullname must be 3 letters long"],
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be atleast 6 letters long"],
    },
    tasks: {
      type: [Schema.Types.ObjectId],
      ref: "Task",
      default: [],
    },
  },
  {
    timestamps: {
      createdAt: "joinedAt",
    },
  }
);

module.exports = mongoose.model("user", userSchema);
// module.exports = mongoose.model("Task", taskSchema);