import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: "localhost", 
      user: "root", 
      password: "", 
      database: "slotabong",
    });

    // SEKARANG KITA PANGGIL 'created_at' AGAR MUNCUL DI TABEL
   // Ganti query SELECT Boss jadi:
const [rows] = await connection.execute(
  "SELECT id, pasaran, periode, result, tanggal, created_at FROM togel_results ORDER BY tanggal DESC, periode DESC"
);

    await connection.end();
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}