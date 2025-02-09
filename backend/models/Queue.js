import mongoose from "mongoose";

const queueSchema = new mongoose.Schema(
  {
    queue_number: { type: Number, required: true },
    paper_name: { type: String, required: true },
    status: { type: String, default: "On Queue" },
    reason: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }  // This automatically adds `createdAt` and `updatedAt` fields
);

export default mongoose.model("Queue", queueSchema);
