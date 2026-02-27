import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// 1. Hubungkan ke Supabase
const SUPABASE_URL = 'https://hqsahuywehlbwywyzlsz.supabase.co'
const SUPABASE_KEY = 'sb_publishable_PiwkCSc05QG4DjULYyUjTw_0R1uUux6'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, nominal, password } = body;

    if (!username || !nominal || !password) {
      return NextResponse.json({ success: false, message: "Data tidak lengkap!" });
    }

    // 2. Ambil data member dari Supabase
    const { data: userData, error: userError } = await supabase
      .from('members')
      .select('password, nama_bank, nama_rekening, nomor_rekening, saldo')
      .eq('username', username)
      .maybeSingle();

    if (userError || !userData) {
      return NextResponse.json({ success: false, message: "User tidak ditemukan!" });
    }

    // 3. Cek Password WD
    if (userData.password !== password) {
      return NextResponse.json({ success: false, message: "Password WD Salah!" });
    }

    // 4. Cek Saldo
    if (Number(userData.saldo) < Number(nominal)) {
      return NextResponse.json({ success: false, message: "Saldo tidak cukup!" });
    }

    // 5. Masukkan data ke tabel 'withdrawals' di Supabase
    const { error: wdError } = await supabase
      .from('withdrawals')
      .insert([
        { 
          username, 
          nominal: parseFloat(nominal),
          bank: userData.nama_bank,
          nama_rekening: userData.nama_rekening,
          nomor_rekening: userData.nomor_rekening,
          status: 'PENDING'
        }
      ]);

    if (wdError) throw wdError;

    // 6. Potong Saldo Member
    const saldoBaru = Number(userData.saldo) - Number(nominal);
    const { error: updateError } = await supabase
      .from('members')
      .update({ saldo: saldoBaru })
      .eq('username', username);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, message: "WD Berhasil Dikirim, Mohon Tunggu!" });

  } catch (error) {
    console.error("WD ERROR:", error.message);
    return NextResponse.json({ success: false, message: "Kesalahan Sistem: " + error.message }, { status: 500 });
  }
}
