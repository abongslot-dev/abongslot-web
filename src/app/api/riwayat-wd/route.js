import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(request) { // Tambahkan parameter 'request' di sini
  let connection;
  try {
    // 1. Ambil username dari URL (Hasil kiriman dari fetch frontend)
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json({ success: false, message: "Username tidak terdeteksi" });
    }

    connection = await mysql.createConnection({
      host: "localhost", user: "root", password: "", database: "slotabong",
    });

    // 2. TAMBAHKAN FILTER USERNAME DI SQL
    // Kita pakai '?' untuk keamanan (Prevent SQL Injection)
    const [rows] = await connection.execute(
      "SELECT * FROM `withdrawals` WHERE `username` = ? AND `status` != 'PENDING' ORDER BY `created_at` DESC",
      [username] // Data username dimasukkan ke sini
    );

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  } finally {
    if (connection) await connection.end();
  }
}