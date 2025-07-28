import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Umkm = db.define(
  "umkm",
  {
    nama: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    foto: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "/uploads/default-umkm.jpg",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

export default Umkm;

(async () => {
  await db.sync({ alter: true });
})();
