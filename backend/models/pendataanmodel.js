import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const Pendataan = db.define(
  "pendataan",
  {
    jumlah: DataTypes.INTEGER,
    Pendataan: DataTypes.STRING,
  },
  {
    freezeTableName: true,
  }
);

export default Pendataan;

(async () => {
  await db.sync({ alter: true });
})();
