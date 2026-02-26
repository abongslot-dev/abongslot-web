import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(req) {
  let connection;
  try {
    const { field, value } = await req.json();

    connection = await mysql.createConnection({
      host: "localhost", 
      user: "root", 
      password: "", 
      database: "slotabong",
    });

    // Sesuaikan field dari frontend ke nama kolom di tabel 'members' Bos
    let columnName = field;
    if (field === "whatsapp") columnName = "nomor_whatsapp";
    if (field === "nomorRekening") columnName = "nomor_rekening";
    if (field === "username") columnName = "username";

    // Query untuk cek apakah data sudah ada
    const [rows] = await connection.execute(
      `SELECT id FROM members WHERE ${columnName} = ? LIMIT 1`,
      [value]
    );

    // Kirim jawaban: true jika ada (sudah terdaftar), false jika kosong (tersedia)
    return NextResponse.json({ exists: rows.length > 0 });

  } catch (error) {
    console.error("Check Data Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}