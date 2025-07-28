import express from "express";
import cors from "cors";
import path from "path";

import KepengurusanRoute from "./route/KepengurusanRoute.js";
import AdminRoute from "./route/AdminRoute.js";
import UmkmRoute from "./route/UmkmRoute.js";
import AsetRoute from "./route/AsetRoute.js";
import PendataanRoute from "./route/PendataanRoute.js";

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/kepengurusan", KepengurusanRoute);
app.use("/admins", AdminRoute);
app.use("/umkm", UmkmRoute);
app.use("/aset", AsetRoute);
app.use("/pendataan", PendataanRoute);

app.listen(5001, () => console.log("Server running on port 5001"));
