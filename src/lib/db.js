import mysql from 'mysql2/promise';

export const db = async () => {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '', 
      database: 'slotabong', 
    });
    return connection;
  } catch (error) {
    console.error("Koneksi Database Gagal:", error.message);
    throw error;
  }
};

// TAMBAHKAN BARIS INI DI PALING BAWAH
export default db;