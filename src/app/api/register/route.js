import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(req) {
  let connection;
  try {
    const body = await req.json();
    const { username, password, whatsapp, bank, namaRekening, nomorRekening } = body;

    // 1. Buat Koneksi
    connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "", 
      database: "slotabong", 
    });

    // --- 2. VALIDASI DATA GANDA (WAJIB ADA) ---
    // Kita cek apakah salah satu dari data ini sudah ada di database
    const [existingUsers] = await connection.execute(
      "SELECT username, nomor_whatsapp, nomor_rekening FROM members WHERE username = ? OR nomor_whatsapp = ? OR nomor_rekening = ?",
      [username, whatsapp, nomorRekening]
    );

    if (existingUsers.length > 0) {
      const userLama = existingUsers[0];
      let pesanError = "Data sudah terdaftar!";

      if (userLama.username === username) pesanError = "Username sudah digunakan!";
      else if (userLama.nomor_whatsapp === whatsapp) pesanError = "Nomor WhatsApp sudah terdaftar!";
      else if (userLama.nomor_rekening === nomorRekening) pesanError = "Nomor Rekening sudah terdaftar!";

      return NextResponse.json({ 
        success: false, 
        message: pesanError 
      }, { status: 400 }); // Status 400 = Bad Request
    }

    // 3. Query Insert (Jika lolos pengecekan di atas)
    const query = `
      INSERT INTO members 
      (username, password, nomor_whatsapp, nama_bank, nama_rekening, nomor_rekening, saldo) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    // 4. Eksekusi
    await connection.execute(query, [
      username, 
      password, 
      whatsapp, 
      bank, 
      namaRekening, 
      nomorRekening, 
      0 // Saldo awal
    ]);

    return NextResponse.json({ 
      success: true, 
      message: "Pendaftaran Berhasil!" 
    }, { status: 200 });

  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Gagal simpan ke database: " + error.message 
    }, { status: 500 });
  } finally {
    // 5. Pastikan koneksi selalu tertutup baik sukses maupun gagal
    if (connection) await connection.end();
  }
}