import express from "express";
import { getQueue, addPaper, updateStatus } from "../controllers/queueController.js";

const router = express.Router();

router.get("/", getQueue);
router.post("/add", addPaper);
router.put("/update/:id", updateStatus);

export default router;
