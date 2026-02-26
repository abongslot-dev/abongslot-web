import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    // 1. Koneksi ke Database (Sesuaikan dengan settingan phpMyAdmin kamu)
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root", 
      password: "", // Kosongkan jika pakai XAMPP standar
      database: "slotabong", // Pastikan nama database-nya benar
    });

    // 2. Cari user yang Username DAN Password-nya cocok
    // Pakai Query SELECT untuk mengambil data
    const [rows] = await connection.execute(
  "SELECT username, saldo FROM members WHERE BINARY username = ? AND BINARY password = ?",
  [username, password]
);

    await connection.end();

    // 3. Cek apakah user ketemu
    if (rows.length > 0) {
      const user = rows[0];
      return NextResponse.json({ 
        success: true, 
        username: user.username,
        saldo: user.saldo 
      }, { status: 200 });
    } else {
      // Jika tidak ketemu, kirim pesan error
      return NextResponse.json({ 
        success: false, 
        message: "Username atau Password salah!" 
      }, { status: 401 });
    }

  } catch (error) {
    console.error("DATABASE ERROR:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Terjadi kesalahan pada server database" 
    }, { status: 500 });
  }
}