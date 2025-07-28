import Umkm from "../models/umkmmodel.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// Setup multer untuk upload foto
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "umkm-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export const getUmkm = async (req, res) => {
  try {
    const response = await Umkm.findAll();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUmkmById = async (req, res) => {
  try {
    const response = await Umkm.findOne({ where: { id: req.params.id } });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createUmkm = async (req, res) => {
  try {
    const { nama, deskripsi } = req.body;
    let foto = "/uploads/default-umkm.jpg"; // Default foto

    if (req.file) {
      foto = "/uploads/" + req.file.filename;
    }

    await Umkm.create({ nama, deskripsi, foto });
    res.status(201).json({ msg: "UMKM Created" });
  } catch (error) {
    console.error("Error creating UMKM:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateUmkm = async (req, res) => {
  try {
    const { nama, deskripsi } = req.body;
    const umkmId = req.params.id;

    // Get current umkm data
    const currentUmkm = await Umkm.findOne({ where: { id: umkmId } });
    if (!currentUmkm) {
      return res.status(404).json({ error: "UMKM not found" });
    }

    let updateData = { nama, deskripsi };

    // If new file uploaded
    if (req.file) {
      // Delete old file if it's not the default
      if (currentUmkm.foto && currentUmkm.foto !== "/uploads/default-umkm.jpg") {
        const oldFilePath = path.join(process.cwd(), currentUmkm.foto);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      updateData.foto = "/uploads/" + req.file.filename;
    }

    await Umkm.update(updateData, { where: { id: umkmId } });
    res.status(200).json({ msg: "UMKM Updated" });
  } catch (error) {
    console.error("Error updating UMKM:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteUmkm = async (req, res) => {
  try {
    const umkmId = req.params.id;

    // Get umkm data before deletion
    const umkm = await Umkm.findOne({ where: { id: umkmId } });
    if (umkm && umkm.foto && umkm.foto !== "/uploads/default-umkm.jpg") {
      const filePath = path.join(process.cwd(), umkm.foto);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Umkm.destroy({ where: { id: umkmId } });
    res.status(200).json({ msg: "UMKM Deleted" });
  } catch (error) {
    console.error("Error deleting UMKM:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
