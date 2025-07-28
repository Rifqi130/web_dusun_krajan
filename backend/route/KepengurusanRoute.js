import express from "express";
import { getKepengurusan, getKepengurusanById, createKepengurusan, updateKepengurusan, deleteKepengurusan } from "../controller/KepengurusanController.js";

const router = express.Router();

// CRUD Kepengurusan
router.get("/", getKepengurusan);
router.get("/:id", getKepengurusanById);
router.post("/", createKepengurusan);
router.patch("/:id", updateKepengurusan);
router.delete("/:id", deleteKepengurusan);

export default router;
