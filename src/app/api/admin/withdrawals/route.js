import { NextResponse } from "next/server"; // WAJIB next/server
import { db } from "@/lib/db";

export async function GET() {
  let connection;
  try {
    connection = await db();
    
    // Ambil data WD yang statusnya PENDING
    const [rows] = await connection.query(
  "SELECT * FROM withdrawals WHERE status = 'PENDING' ORDER BY created_at DESC"
);

    // Kirim balik data dalam format JSON
    return NextResponse.json({ 
      success: true, 
      requests: rows 
    });

  } catch (error) {
    console.error("ERROR API ADMIN:", error.message);
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });

  } finally {
    if (connection) await connection.end();
  }
}