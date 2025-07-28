import express from "express";
import { getPendataan, getPendataanById, createPendataan, updatePendataan, deletePendataan, getStatistics } from "../controller/PendataanController.js";

const router = express.Router();

// CRUD Pendataan
router.get("/", getPendataan);
router.get("/statistics", getStatistics);
router.get("/:id", getPendataanById);
router.post("/", createPendataan);
router.patch("/:id", updatePendataan);
router.delete("/:id", deletePendataan);

export default router;
