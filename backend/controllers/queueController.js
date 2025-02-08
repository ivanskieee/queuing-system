import Queue from "../models/Queue.js";

// Get all queue items
export const getQueue = async (req, res) => {
  try {
    const queue = await Queue.find().sort({ createdAt: 1 });
    res.json(queue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a new paper to queue
export const addPaper = async (req, res) => {
  try {
    const lastQueue = await Queue.findOne().sort({ queueNumber: -1 });
    const nextQueueNumber = lastQueue ? lastQueue.queueNumber + 1 : 1;

    const newQueue = new Queue({
      queueNumber: nextQueueNumber,
      paperName: req.body.paperName,
    });

    await newQueue.save();
    res.json({ message: "Paper added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update status
export const updateStatus = async (req, res) => {
  try {
    await Queue.findByIdAndUpdate(req.params.id, { status: req.body.status });
    res.json({ message: "Status updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
