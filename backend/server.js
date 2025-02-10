import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import Queue from "./models/Queue.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: null, useUnifiedTopology: null })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

// 🟢 Get all queue items
app.get("/api/queue", async (req, res, next) => {
  try {
    const queue = await Queue.find().sort({ createdAt: 1 });
    res.json(queue);
  } catch (err) {
    next(err);
  }
});

// 🔵 Add a new queue item
// app.post("/api/queue", async (req, res, next) => {
//   try {
//     const { paper_name } = req.body;
//     if (!paper_name?.trim()) {
//       return res.status(400).json({ error: "Paper name cannot be empty!" });
//     }

//     const lastItem = await Queue.findOne().sort({ queue_number: -1 });
//     const newQueueNumber = lastItem ? lastItem.queue_number + 1 : 1;

//     const newQueueItem = new Queue({ queue_number: newQueueNumber, paper_name, status: "Received" });
//     await newQueueItem.save();

//     res.status(201).json(newQueueItem);
//   } catch (err) {
//     next(err);
//   }
// });
// 🔵 Add a new queue item
app.post("/api/queue", async (req, res, next) => {
  try {
    const { paper_name, reason } = req.body;
    if (!paper_name?.trim() || !reason?.trim()) {
      return res.status(400).json({ error: "Paper name and reason cannot be empty!" });
    }

    const lastItem = await Queue.findOne().sort({ queue_number: -1 });
    const newQueueNumber = lastItem ? lastItem.queue_number + 1 : 1;

    const newQueueItem = new Queue({
      queue_number: newQueueNumber,
      paper_name,
      reason,
      status: "On Queue",
    });
    
    await newQueueItem.save();
    res.status(201).json(newQueueItem);
  } catch (err) {
    next(err);
  }
});


// 🟠 Update queue status
app.put("/api/queue/:id", async (req, res, next) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!status) {
      return res.status(400).json({ error: "Status is required!" });
    }

    const updatedQueue = await Queue.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedQueue) {
      return res.status(404).json({ error: "Queue item not found!" });
    }

    res.json(updatedQueue);
  } catch (err) {
    next(err);
  }
});

// 🟣 Serve next item (delete first "Ready for Pickup")
app.delete("/api/queue/serve/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedItem = await Queue.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ error: "Queue item not found!" });
    }

    res.json({ message: "Queue item served", deletedItem });
  } catch (err) {
    next(err);
  }
});

// 🔴 Delete all queue items
app.delete("/api/queue", async (req, res, next) => {
  try {
    const count = await Queue.countDocuments(); // Check if there are any documents

    if (count === 0) {
      return res.status(400).json({ message: "Queue is already empty" });
    }

    await Queue.deleteMany({});
    res.status(200).json({ message: "Queue cleared" });
  } catch (err) {
    next(err);
  }
});


// 🛑 Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(500).json({ error: "Internal Server Error", details: err.message });
});

// 🌍 Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
