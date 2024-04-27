const mongoose = require("mongoose");

const { Schema } = mongoose;

const taskSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      maxlength: 200,
      required: true,
    },
    dueDate: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "in progress", "completed"],
    },
    priority: {
      type: String,
      required: true,
      enum: ["low", "medium", "high"],
    },
    creator: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: {
      createdAt: "publishedAt",
    },
  }
);

module.exports = mongoose.model("Task", taskSchema);
