import express from "express";
import { adminAuth } from '../middleware2/adminAuth.js'
import pool from "../db/connection.js";

const router = express.Router();


router.get("/", adminAuth, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post("/", adminAuth, async (req, res) => {
  const { name, email } = req.body;

  try {
    const [result] = await pool.query(
      "INSERT INTO users (username, email) VALUES (?, ?)",
      [name, email]
    );
    res.json({ id: result.insertId, name, email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.delete("/:id", adminAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Korisnik nije pronaden" });
    }
    res.json({ message: "Korisnik uspješno pobrisan" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.put('/:id/role', adminAuth, async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role) return res.status(400).json({ message: 'Potreban je status' });

  try {
    const [result] = await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Uspješno promjenjen status' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Neuspjela promjena statusa' });
  }
});

export default router;
