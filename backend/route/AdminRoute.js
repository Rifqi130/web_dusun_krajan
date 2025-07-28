import express from "express";
import { getAdmins, getAdminById, createAdmin, updateAdmin, deleteAdmin, loginAdmin } from "../controller/AdminController.js";

const router = express.Router();

// Login Admin
router.post('/login', loginAdmin);

// CRUD Admins
router.get('/', getAdmins);
router.get('/:id', getAdminById);
router.post('/', createAdmin);
router.patch('/:id', updateAdmin);
router.delete('/:id', deleteAdmin);

export default router;