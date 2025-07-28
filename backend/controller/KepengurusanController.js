import { where } from "sequelize";
import Kepengurusan from "../models/kepengurusanmodel.js";

// Ambil semua kepengurusan
export const getKepengurusan = async (req, res) => {
  try {
    const response = await Kepengurusan.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Ambil kepengurusan berdasarkan id
export const getKepengurusanById = async (req, res) => {
  try {
    const response = await Kepengurusan.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Tambah kepengurusan baru
export const createKepengurusan = async (req, res) => {
  try {
    await Kepengurusan.create(req.body);
    res.status(201).json({ msg: "Kepengurusan Created" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update kepengurusan
export const updateKepengurusan = async (req, res) => {
  try {
    await Kepengurusan.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Kepengurusan Updated" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Hapus kepengurusan
export const deleteKepengurusan = async (req, res) => {
  try {
    await Kepengurusan.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Kepengurusan Deleted" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
