import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) return NextResponse.json({ success: false }, { status: 400 });

    const connection = await mysql.createConnection({
      host: "localhost", user: "root", password: "", database: "slotabong",
    });

    // Ambil riwayat deposit berdasarkan username
    const [rows] = await connection.execute(
      "SELECT * FROM deposits WHERE username = ? ORDER BY created_at DESC LIMIT 50",
      [username]
    );

    await connection.end();
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}