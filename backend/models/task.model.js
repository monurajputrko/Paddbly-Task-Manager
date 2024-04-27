import mongoose, { Schema } from "mongoose";

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

export default mongoose.model("Task", taskSchema);
