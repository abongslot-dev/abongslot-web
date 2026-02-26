import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(req) {
  let connection;
  try {
    const body = await req.json();
    
    // 1. Tangkap SEMUA data yang dikirim dari frontend
    const { 
      username, 
      nominal, 
      promo, 
      bank_pengirim, 
      rek_pengirim, 
      nama_pengirim,
      bank_tujuan, 
      rek_tujuan, 
      nama_tujuan 
    } = body;

    // 2. Koneksi ke Database
    connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "", 
      database: "slotabong",
    });

    // 3. Update Query INSERT (Pastikan kolom-kolom ini sudah ada di PHPMyAdmin)
 // PASTIKAN URUTANNYA SAMA ANTARA KOLOM DAN DATA NYA
const query = `
  INSERT INTO deposits (
    username, 
    nominal, 
    promo, 
    bank_pengirim, 
    rek_pengirim, 
    nama_pengirim, 
    bank_tujuan, 
    rek_tujuan, 
    nama_tujuan, 
    status, 
    created_at
  ) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())
`;

// Array data ini harus 9 item sesuai tanda tanya (?) di atas
await connection.execute(query, [
  username, 
  nominal, 
  promo, 
  bank_pengirim, // Data baru masuk sini
  rek_pengirim,  // Data baru masuk sini
  nama_pengirim, // Data baru masuk sini
  bank_tujuan, 
  rek_tujuan, 
  nama_tujuan
]);

    return NextResponse.json({ message: "Deposit Berhasil Dicatat" }, { status: 200 });

  } catch (error) {
    console.error("API ERROR DEPOSIT:", error.message);
    return NextResponse.json(
      { error: "Gagal simpan ke database: " + error.message }, 
      { status: 500 }
    );
  } finally {
    if (connection) await connection.end();
  }
}