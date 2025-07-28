import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const Kepengurusan = db.define(
  "kepengurusan",
  {
    name: DataTypes.STRING,
    Jabatan: DataTypes.STRING,
  },
  {
    freezeTableName: true,
  }
);

export default Kepengurusan;

(async () => {
  await db.sync({ alter: true });
})();
