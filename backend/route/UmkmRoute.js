import express from "express";
import { getUmkm, getUmkmById, createUmkm, updateUmkm, deleteUmkm, upload } from "../controller/UmkmController.js";

const router = express.Router();

router.get("/", getUmkm);
router.get("/:id", getUmkmById);
router.post("/", upload.single("foto"), createUmkm);
router.patch("/:id", upload.single("foto"), updateUmkm);
router.delete("/:id", deleteUmkm);

export default router;
