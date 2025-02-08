import mongoose from "mongoose";

const QueueSchema = new mongoose.Schema({
  queue_number: { type: Number, required: true, unique: true },
  paper_name: { type: String, required: true },
  status: { type: String, default: "Received" },
}, { timestamps: true });

export default mongoose.model("Queue", QueueSchema);
