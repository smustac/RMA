import express from "express";
import pool from "../db/connection.js";
import auth from "../../middleware/auth2.js";
import isAdmin from "../../middleware/isAdmin.js";

const router = express.Router();


router.use(auth); //koristi za zaštitu ruta
router.use(isAdmin);


router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM admins");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
