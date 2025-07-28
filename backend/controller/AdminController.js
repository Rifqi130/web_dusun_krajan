import { where } from "sequelize";
import Admin from "../models/adminmodel.js";

// Ambil semua admin
export const getAdmins = async (req, res) => {
  try {
    const response = await Admin.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Ambil admin berdasarkan id
export const getAdminById = async (req, res) => {
  try {
    const response = await Admin.findOne({
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

// Tambah admin baru
export const createAdmin = async (req, res) => {
  try {
    await Admin.create(req.body);
    res.status(201).json({ msg: "Admin Created" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update admin
export const updateAdmin = async (req, res) => {
  try {
    await Admin.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Admin Updated" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Hapus admin
export const deleteAdmin = async (req, res) => {
  try {
    await Admin.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Admin Deleted" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { name, password } = req.body;
    const admin = await Admin.findOne({ where: { name, password } });
    if (!admin) {
      return res.status(401).json({ error: "Username or password incorrect" });
    }
    // Bisa tambahkan token/session di sini jika mau
    res.status(200).json({ msg: "Login success" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};