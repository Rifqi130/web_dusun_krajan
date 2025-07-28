import { where } from "sequelize";
import Pendataan from "../models/pendataanmodel.js";

// Ambil semua Pendataan
export const getPendataan = async (req, res) => {
  try {
    const response = await Pendataan.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Ambil Pendataan berdasarkan id
export const getPendataanById = async (req, res) => {
  try {
    const response = await Pendataan.findOne({
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

// Tambah Pendataan baru
export const createPendataan = async (req, res) => {
  try {
    await Pendataan.create(req.body);
    res.status(201).json({ msg: "Pendataan Created" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update Pendataan
export const updatePendataan = async (req, res) => {
  try {
    await Pendataan.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Pendataan Updated" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Hapus Pendataan
export const deletePendataan = async (req, res) => {
  try {
    await Pendataan.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Pendataan Deleted" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get statistics for charts
export const getStatistics = async (req, res) => {
  try {
    const data = await Pendataan.findAll();

    // Initialize statistics
    const stats = {
      laki_laki: 0,
      perempuan: 0,
      bayi: 0,
      balita: 0,
      kanak_kanak: 0,
      remaja: 0,
      dewasa: 0,
      lansia: 0,
    };

    // Process data to aggregate values
    data.forEach((item) => {
      const category = item.Pendataan.toLowerCase();
      const jumlah = parseInt(item.jumlah) || 0;

      if (category === "laki-laki") {
        stats.laki_laki += jumlah;
      } else if (category === "perempuan") {
        stats.perempuan += jumlah;
      } else if (category.includes("bayi") || category.includes("<1 tahun")) {
        stats.bayi += jumlah;
      } else if (category.includes("balita") || category.includes("1-5 tahun")) {
        stats.balita += jumlah;
      } else if (category.includes("anak-anak") || category.includes("6-12 tahun")) {
        stats.kanak_kanak += jumlah;
      } else if (category.includes("remaja") || category.includes("13-19 tahun")) {
        stats.remaja += jumlah;
      } else if (category.includes("dewasa") || category.includes("20-59 tahun")) {
        stats.dewasa += jumlah;
      } else if (category.includes("lansia") || category.includes(">60 tahun")) {
        stats.lansia += jumlah;
      }
    });

    // Calculate total
    stats.total = stats.laki_laki + stats.perempuan;

    res.status(200).json(stats);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
