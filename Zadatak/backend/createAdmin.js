import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

async function createAdmin() {
  const username = 'Stipe';
  const email = 'stipe.mu2004@gmail.com';
  const password = '123'; 

  const hashedPassword = await bcrypt.hash(password, 10); 

  const [result] = await pool.query(
    'INSERT INTO admins (username, email, password) VALUES (?, ?, ?)',
    [username, email, hashedPassword]
  );

  console.log('Admin created with id:', result.insertId);
  process.exit();
}

createAdmin();