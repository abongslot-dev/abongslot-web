import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: "localhost", 
      user: "root", 
      password: "", 
      database: "slotabong",
    });

    // 1. Hitung Summary Deposit (Pake UPPER biar gak sensitif huruf besar/kecil)
  const [depoRows] = await connection.execute(`
  SELECT 
    -- Menghitung PENDING (Kosong, NULL, atau tulisan 'pending')
    SUM(CASE WHEN status = '' OR status IS NULL OR LOWER(status) = 'pending' THEN 1 ELSE 0 END) as countPending,
    SUM(CASE WHEN status = '' OR status IS NULL OR LOWER(status) = 'pending' THEN nominal ELSE 0 END) as totalPending,
    
    -- Menghitung SUCCESS/APPROVE
    SUM(CASE WHEN LOWER(status) = 'approve' OR LOWER(status) = 'success' THEN 1 ELSE 0 END) as countSuccess,
    SUM(CASE WHEN LOWER(status) = 'approve' OR LOWER(status) = 'success' THEN nominal ELSE 0 END) as totalSuccess,
    
    -- Menghitung REJECT
    SUM(CASE WHEN LOWER(status) = 'reject' THEN 1 ELSE 0 END) as countReject,
    SUM(CASE WHEN LOWER(status) = 'reject' THEN nominal ELSE 0 END) as totalReject
  FROM deposits
`);


// TAMBAHKAN BARIS INI UNTUK MENGINTIP:
    const [cekStatus] = await connection.execute("SELECT DISTINCT status FROM deposits");
    console.log("STATUS YANG ADA DI DATABASE:", cekStatus);

// 2. Hitung Summary Withdrawal (Samakan logikanya)
const [wdRows] = await connection.execute(`
  SELECT 
    -- PENDING: Menghitung yang kosong, NULL, atau tulisan 'pending' / 'PENDING'
    SUM(CASE WHEN status = '' OR status IS NULL OR LOWER(status) = 'pending' THEN 1 ELSE 0 END) as countPending,
    SUM(CASE WHEN status = '' OR status IS NULL OR LOWER(status) = 'pending' THEN nominal ELSE 0 END) as totalPending,
    
    -- SUCCESS: Menghitung 'success', 'SUCCESS', atau 'approve'
    SUM(CASE WHEN LOWER(status) = 'success' OR LOWER(status) = 'approve' THEN 1 ELSE 0 END) as countSuccess,
    SUM(CASE WHEN LOWER(status) = 'success' OR LOWER(status) = 'approve' THEN nominal ELSE 0 END) as totalSuccess,
    
    -- REJECT: Menghitung 'reject' atau 'REJECT'
    SUM(CASE WHEN LOWER(status) = 'reject' THEN 1 ELSE 0 END) as countReject,
    SUM(CASE WHEN LOWER(status) = 'reject' THEN nominal ELSE 0 END) as totalReject
  FROM withdrawals
`);
   // GANTI BAGIAN INI SAJA DI FILE KAMU:
    return NextResponse.json({
      success: true,
      deposit: {
        countPending: Number(depoRows[0].countPending || 0),
        totalPending: Number(depoRows[0].totalPending || 0),
        countSuccess: Number(depoRows[0].countSuccess || 0),
        totalSuccess: Number(depoRows[0].totalSuccess || 0),
        countReject: Number(depoRows[0].countReject || 0),
        totalReject: Number(depoRows[0].totalReject || 0),
      },
      withdraw: {
        countPending: Number(wdRows[0].countPending || 0),
        totalPending: Number(wdRows[0].totalPending || 0),
        countSuccess: Number(wdRows[0].countSuccess || 0),
        totalSuccess: Number(wdRows[0].totalSuccess || 0),
        countReject: Number(wdRows[0].countReject || 0),
        totalReject: Number(wdRows[0].totalReject || 0),
      }
    });
  } catch (error) {
    console.error("Dashboard API Error:", error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}