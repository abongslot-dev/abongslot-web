import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic';

const SUPABASE_URL = 'https://hqsahuywehlbwywyzlsz.supabase.co'
const SUPABASE_KEY = 'sb_secret_oAmh3QwRBQivTeGj0zwhIw_Dn_vwHxA'

// Konfigurasi Client yang lebih stabil untuk Vercel
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
  global: {
    fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }),
  },
})

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, password, whatsapp, bank, namaRekening, nomorRekening } = body;

    // 1. Cek User Ganda (Gunakan tanda kutip agar tidak Fetch Failed)
    const { data: userLama, error: checkError } = await supabase
      .from('members')
      .select('username')
      .or(`username.eq."${username}",nomor_whatsapp.eq."${whatsapp}",nomor_rekening.eq."${nomorRekening}"`)
      .maybeSingle();

    if (checkError) throw new Error("Gagal cek data: " + checkError.message);

    if (userLama) {
      return NextResponse.json({ success: false, message: "Data sudah terdaftar!" }, { status: 400 });
    }

    // 2. Simpan ke Database (PASTIKAN KOLOM SESUAI GAMBAR SUPABASE KAMU)
    const { error: insertError } = await supabase
      .from('members')
      .insert([
        { 
          username: username.trim(), 
          password: password, 
          nomor_whatsapp: whatsapp, 
          nama_bank: bank, 
          nama_rekening: namaRekening, 
          nomor_rekening: nomorRekening, 
          saldo: 0,
          status: "AKTIF" // <--- INI KUNCINYA! Harus ada sesuai tabel kamu
        }
      ]);

    if (insertError) throw insertError;

    return NextResponse.json({ success: true, message: "Pendaftaran Berhasil!" }, { status: 200 });

  } catch (error) {
    console.error("DETEKSI ERROR REGISTER:", error.message);
    return NextResponse.json({ 
      success: false, 
      message: "Gagal daftar: " + error.message 
    }, { status: 500 });
  }
}
