import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// --- UNTUK TERIMA/TOLAK (POST) ---
export async function POST(req) {
  let connection;
  try {
    const body = await req.json();
    console.log("--- DATA DARI FORM ---", body); // <--- CEK INI DI TERMINAL

    connection = await mysql.createConnection({
      host: "localhost", user: "root", password: "", database: "slotabong",
    });

    // 1. CEK APAKAH INI INSERT (MEMBER) ATAU UPDATE (ADMIN)
    if (!body.id) {
      console.log("MENCOBA INSERT DATA BARU...");
      const [result] = await connection.execute(
        "INSERT INTO deposits (username, nominal, bank_tujuan, status, created_at) VALUES (?, ?, ?, '', NOW())",
        [body.username, body.nominal, body.bank_tujuan || '']
      );
      console.log("HASIL INSERT:", result);
      return NextResponse.json({ success: true });
    }

    // 2. LOGIKA UPDATE ADMIN
    console.log("MENCOBA UPDATE STATUS ID:", body.id);
    let finalStatus = (body.status === 'SUCCESS' || body.status === 'approve') ? 'approve' : 'reject';

    await connection.beginTransaction();

    const [updDepo] = await connection.execute(
      "UPDATE deposits SET status = ?, processed_at = NOW() WHERE id = ?",
      [finalStatus, body.id]
    );
    console.log("UPDATE DEPO BERHASIL:", updDepo);

    if (finalStatus === 'approve') {
      const [updMember] = await connection.execute(
        "UPDATE members SET saldo = saldo + ? WHERE username = ?",
        [Number(body.nominal), body.username]
      );
      console.log("UPDATE SALDO BERHASIL:", updMember);
    }

    await connection.commit();
    return NextResponse.json({ success: true });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error("❌ ERROR DETECTED:", error.message); // <--- LIHAT PESAN INI DI TERMINAL
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}

// --- UNTUK RANGKUMAN (GET) ---
export async function GET() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: "localhost", user: "root", password: "", database: "slotabong",
    });

    // Kita ambil SEMUA data tanpa tapi-tapi, buat ngetes doang
    const [rows] = await connection.execute(
      "SELECT * FROM deposits ORDER BY created_at DESC"
    );

    console.log("Data ditemukan di DB:", rows.length); // Cek di terminal/log

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}