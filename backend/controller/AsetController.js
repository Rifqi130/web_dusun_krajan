import Aset from "../models/asetmodel.js";
import { Op } from "sequelize";
import fs from "fs";
import path from "path";

// Get all aset
export const getAset = async (req, res) => {
  try {
    const response = await Aset.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get aset by ID
export const getAsetById = async (req, res) => {
  try {
    const response = await Aset.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!response) {
      return res.status(404).json({ error: "Aset not found" });
    }

    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Create aset with photo upload
export const createAset = async (req, res) => {
  try {
    const { nama, tempat } = req.body;

    // Validate required fields
    if (!nama || !tempat) {
      return res.status(400).json({
        error: "Nama dan tempat harus diisi",
      });
    }

    // Handle photo upload
    let fotoPath = null;
    if (req.file) {
      fotoPath = req.file.filename;
    }

    const newAset = await Aset.create({
      nama,
      tempat,
      foto: fotoPath,
    });

    res.status(201).json({
      msg: "Aset berhasil ditambahkan",
      data: newAset,
    });
  } catch (error) {
    console.log(error.message);

    // Delete uploaded file if error occurs
    if (req.file) {
      const filePath = path.join(process.cwd(), "uploads", "aset", req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update aset
export const updateAset = async (req, res) => {
  try {
    const { nama, tempat } = req.body;
    const asetId = req.params.id;

    // Find existing aset
    const existingAset = await Aset.findOne({
      where: { id: asetId },
    });

    if (!existingAset) {
      // Delete uploaded file if aset not found
      if (req.file) {
        const filePath = path.join(process.cwd(), "uploads", "aset", req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      return res.status(404).json({ error: "Aset not found" });
    }

    // Prepare update data
    const updateData = {};
    if (nama) updateData.nama = nama;
    if (tempat) updateData.tempat = tempat;

    // Handle photo update
    if (req.file) {
      // Delete old photo if exists
      if (existingAset.foto) {
        const oldPhotoPath = path.join(process.cwd(), "uploads", "aset", existingAset.foto);
        if (fs.existsSync(oldPhotoPath)) {
          try {
            fs.unlinkSync(oldPhotoPath);
          } catch (err) {
            console.log("Error deleting old photo:", err.message);
          }
        }
      }
      updateData.foto = req.file.filename;
    }

    // Update aset
    await Aset.update(updateData, {
      where: { id: asetId },
    });

    // Get updated aset
    const updatedAset = await Aset.findOne({
      where: { id: asetId },
    });

    res.status(200).json({
      msg: "Aset berhasil diupdate",
      data: updatedAset,
    });
  } catch (error) {
    console.log(error.message);

    // Delete uploaded file if error occurs
    if (req.file) {
      const filePath = path.join(process.cwd(), "uploads", "aset", req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete aset
export const deleteAset = async (req, res) => {
  try {
    const asetId = req.params.id;

    // Find aset to get photo filename
    const aset = await Aset.findOne({
      where: { id: asetId },
    });

    if (!aset) {
      return res.status(404).json({ error: "Aset not found" });
    }

    // Delete photo file if exists
    if (aset.foto) {
      const photoPath = path.join(process.cwd(), "uploads", "aset", aset.foto);
      if (fs.existsSync(photoPath)) {
        try {
          fs.unlinkSync(photoPath);
        } catch (err) {
          console.log("Error deleting photo:", err.message);
        }
      }
    }

    // Delete aset from database
    await Aset.destroy({
      where: { id: asetId },
    });

    res.status(200).json({ msg: "Aset berhasil dihapus" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Search aset by name or location
export const searchAset = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const response = await Aset.findAll({
      where: {
        [Op.or]: [{ nama: { [Op.like]: `%${query}%` } }, { tempat: { [Op.like]: `%${query}%` } }],
      },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
