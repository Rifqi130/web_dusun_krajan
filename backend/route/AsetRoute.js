import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { getAset, getAsetById, createAset, updateAset, deleteAset, searchAset } from "../controller/AsetController.js";

const router = express.Router();

// Create uploads/aset directory if it doesn't exist
const uploadDir = path.join(process.cwd(), "uploads", "aset");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `aset-${uniqueSuffix}${ext}`);
  },
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Hanya file gambar yang diperbolehkan (jpeg, jpg, png, gif, webp)"));
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

// Routes
router.get("/", getAset);
router.get("/search", searchAset);
router.get("/:id", getAsetById);
router.post("/", upload.single("foto"), createAset);
router.patch("/:id", upload.single("foto"), updateAset);
router.delete("/:id", deleteAset);

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File terlalu besar. Maksimal 5MB." });
    }
  }

  if (error.message.includes("Hanya file gambar")) {
    return res.status(400).json({ error: error.message });
  }

  res.status(500).json({ error: "Upload error" });
});

export default router;
