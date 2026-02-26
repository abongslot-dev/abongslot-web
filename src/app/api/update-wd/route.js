import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// --- FUNGSI UNTUK MENERIMA / MENOLAK (POST) ---
export async function POST(req) {
  let connection;
  try {
    const body = await req.json();
    const id = parseInt(body.id);
    const status = body.status;

    connection = await mysql.createConnection({
      host: "localhost", user: "root", password: "", database: "slotabong",
    });

    // TAMBAHKAN processed_at = NOW() DI SINI BOS
    const [result] = await connection.execute(
      "UPDATE `withdrawals` SET `status` = ?, `processed_at` = NOW() WHERE `id` = ?",
      [status, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}

// --- FUNGSI UNTUK RANGKUMAN (GET) ---
export async function GET() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: "localhost", user: "root", password: "", database: "slotabong",
    });

    const [rows] = await connection.execute(
      "SELECT * FROM `withdrawals` WHERE `status` != 'PENDING' ORDER BY `created_at` DESC"
    );

    const totalAll = rows.reduce((sum, item) => sum + Number(item.nominal), 0);

    return NextResponse.json({ success: true, data: rows, totalAll });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}