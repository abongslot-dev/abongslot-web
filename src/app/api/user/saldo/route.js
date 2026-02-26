import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ success: false, message: "Username kosong" }, { status: 400 });
  }

  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "slotabong", // Pastikan nama DB ini benar Bos!
    });

    const [rows] = await connection.execute(
      "SELECT * FROM members WHERE username = ?",
      [username]
    );

    await connection.end();

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "User tidak ditemukan" });
    }

return NextResponse.json({ 
  success: true, 
  saldo: rows[0].saldo || 0,
  user: {
    // Kita samakan namanya dengan yang ada di Database biar Bos gak bingung
    nama_bank: rows[0].nama_bank, 
    nama_rekening: rows[0].nama_rekening, 
    nomor_rekening: rows[0].nomor_rekening
  }
});

  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}