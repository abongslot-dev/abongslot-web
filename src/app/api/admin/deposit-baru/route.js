import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "slotabong",
};

// --- 1. GET (Sama seperti sebelumnya) ---
export async function GET() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      "SELECT * FROM deposits WHERE status = 'pending' ORDER BY created_at DESC"
    );
    return NextResponse.json({ success: true, requests: rows });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}

// --- 2. PATCH (Ganti POST jadi PATCH agar cocok dengan Frontend) ---
export async function PATCH(req) {
  let connection;
  try {
    const { transactionId, status, amount, username } = await req.json();
    
    // Logika Sinkronisasi Status
    // Kita bikin supaya API kenal 'SUCCESS' atau 'APPROVE'
    const isMenerima = ['SUCCESS', 'APPROVE', 'APPROVED'].includes(status.toUpperCase());
    const finalStatus = isMenerima ? 'SUCCESS' : 'REJECTED';

    connection = await mysql.createConnection(dbConfig);
    await connection.beginTransaction();

    // Pastikan pakai transactionId sesuai kiriman frontend
    const [depoRows] = await connection.execute(
      "SELECT status FROM deposits WHERE id = ? FOR UPDATE",
      [transactionId]
    );

    if (depoRows.length === 0 || depoRows[0].status !== 'pending') {
      await connection.rollback();
      return NextResponse.json({ success: false, message: "Data sudah diproses!" });
    }

    // A. Update status deposit
    await connection.execute(
      "UPDATE deposits SET status = ?, processed_at = NOW() WHERE id = ?",
      [finalStatus, transactionId]
    );

    // B. Tambah saldo jika SUCCESS
    if (finalStatus === 'SUCCESS') {
      await connection.execute(
        "UPDATE members SET saldo = saldo + ? WHERE username = ?",
        [Number(amount), username]
      );
    }

    await connection.commit();
    return NextResponse.json({ success: true, message: "Berhasil Update!" });

  } catch (error) {
    if (connection) await connection.rollback();
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}