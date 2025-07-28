import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const Aset = db.define(
  "aset",
  {
    nama: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255],
      },
    },
    tempat: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    foto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: true, // Akan menambahkan createdAt dan updatedAt
  }
);

export default Aset;

// Sync database
(async () => {
  try {
    await db.sync({ alter: true });
    console.log("Aset model synced successfully");
  } catch (error) {
    console.error("Error syncing Aset model:", error);
  }
})();
