import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(req) {
  let connection;
  try {
    const body = await req.json();
    console.log("DATA MASUK KE API:", body);

    // 1. Ambil data dari body (Pastikan 'password' diambil dari sini)
    const { username, nominal, password } = body;

    if (!username || !nominal || !password) {
      return NextResponse.json({ success: false, message: "Data tidak lengkap!" });
    }

    connection = await mysql.createConnection({
      host: "localhost", user: "root", password: "", database: "slotabong",
    });

    // 2. Ambil data member TERMASUK PASSWORD dari database
    const [userRows] = await connection.execute(
      "SELECT `password`, `nama_bank`, `nama_rekening`, `nomor_rekening`, `saldo` FROM `members` WHERE `username` = ?",
      [username]
    );

    if (userRows.length === 0) {
      return NextResponse.json({ success: false, message: "User tidak ditemukan!" });
    }

    const userData = userRows[0];

    // 3. CEK PASSWORD (Membandingkan password input dengan password di DB)
    if (userData.password !== password) {
      return NextResponse.json({ success: false, message: "Password WD Salah!" });
    }

    // 4. Cek saldo
    if (Number(userData.saldo) < Number(nominal)) {
      return NextResponse.json({ success: false, message: "Saldo tidak cukup!" });
    }

    // 5. Insert ke tabel withdrawals
    const sql = "INSERT INTO `withdrawals` (`username`, `nominal`, `bank`, `nama_rekening`, `nomor_rekening`, `status`, `created_at`) VALUES (?, ?, ?, ?, ?, 'PENDING', NOW())";
    
    await connection.execute(sql, [
      username, 
      nominal, 
      userData.nama_bank, 
      userData.nama_rekening, 
      userData.nomor_rekening
    ]);

    // 6. Potong saldo member
    await connection.execute(
      "UPDATE members SET saldo = saldo - ? WHERE username = ?",
      [nominal, username]
    );

    return NextResponse.json({ success: true, message: "WD Berhasil Dikirim!" });

  } catch (error) {
    console.error("WD ERROR:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan sistem" }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}