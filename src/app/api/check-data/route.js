import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic';

const SUPABASE_URL = 'https://hqsahuywehlbwywyzlsz.supabase.co'
const SUPABASE_KEY = 'sb_secret_oAmh3QwRBQivTeGj0zwhIw_Dn_vwHxA'

export async function POST(req) {
  let connection;
  try {
    const { field, value } = await req.json();

  const { data, error } = await supabase
      .from('members')
      .select('username')
      .eq(columnName, cleanValue) // Mencari data yang pas
      .maybeSingle();
    // Sesuaikan field dari frontend ke nama kolom di tabel 'members' Bos
    let columnName = field;
    if (field === "whatsapp") columnName = "nomor_whatsapp";
    if (field === "nomorRekening") columnName = "nomor_rekening";
    if (field === "username") columnName = "username";

    // Query untuk cek apakah data sudah ada
    const [rows] = await connection.execute(
      `SELECT id FROM members WHERE ${columnName} = ? LIMIT 1`,
      [value]
    );

    // Kirim jawaban: true jika ada (sudah terdaftar), false jika kosong (tersedia)
    return NextResponse.json({ exists: rows.length > 0 });

  } catch (error) {
    console.error("Check Data Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}
