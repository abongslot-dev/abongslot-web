import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(req) {
  let connection;
  try {
    const data = await req.json();
    // Kita ambil datanya, tapi variabel 'tanggal' kita abaikan 
    // karena kita mau tanggalnya OTOMATIS ikut waktu simpan.
    const { pasaran, periode, result } = data;

    connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "slotabong",
    });

    // Perhatikan bagian VALUES: Kita isi 'tanggal' dan 'created_at' pakai NOW()
    const query = `
      INSERT INTO togel_results (pasaran, periode, result, tanggal, created_at) 
      VALUES (?, ?, ?, NOW(), NOW()) 
      ON DUPLICATE KEY UPDATE 
        result = VALUES(result),
        tanggal = NOW(),
        created_at = NOW()
    `;

    // Kita cukup mengirim 3 data saja, sisanya diurus database (NOW)
    await connection.execute(query, [pasaran, periode, result]);
    
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error DB:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}