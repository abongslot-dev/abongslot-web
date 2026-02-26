import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(req) {
  try {
    const { username, oldPassword, newPassword } = await req.json();

    // 1. Koneksi ke Database (Sesuaikan dengan XAMPP Bos)
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "", // Kosongkan jika pakai XAMPP standar
      database: "slotabong", // Pastikan nama database-nya benar
    });

    // 2. Cek apakah Password Lama BENAR (Pakai BINARY agar Case Sensitive)
    // Kita cari user yang username DAN password lamanya cocok persis
    const [rows] = await connection.execute(
      "SELECT id FROM members WHERE username = ? AND BINARY password = ?",
      [username, oldPassword]
    );

    // 3. Jika tidak ketemu (Password Lama Salah)
    if (rows.length === 0) {
      await connection.end();
      return NextResponse.json({ 
        success: false, 
        message: "Password lama salah, Bos! Cek huruf besar kecilnya." 
      }, { status: 401 });
    }

    // 4. Jika Benar, Update ke Password Baru
    await connection.execute(
      "UPDATE members SET password = ? WHERE username = ?",
      [newPassword, username]
    );

    await connection.end();

    return NextResponse.json({ 
      success: true, 
      message: "Password berhasil diganti!" 
    }, { status: 200 });

  } catch (error) {
    console.error("DATABASE ERROR:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Waduh, ada masalah di server database!" 
    }, { status: 500 });
  }
}