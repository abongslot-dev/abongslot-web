import { NextResponse } from "next/server";

// Simpan data dummy di sini (Nanti bisa Bos hubungkan ke Database asli)
const dataUserDummy = {
  nama_rekening: "AUREL SEPTIANI",
  nomor_rekening: "123456789981",
  nama_bank: "DANA"
};

export async function GET() {
  try {
    // Kita langsung kirim datanya tanpa cek session dulu biar tidak error
    return NextResponse.json(dataUserDummy);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}