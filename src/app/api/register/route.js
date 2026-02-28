import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic';

const SUPABASE_URL = 'https://hqsahuywehlbwywyzlsz.supabase.co'
const SUPABASE_KEY = 'sb_secret_oAmh3QwRBQivTeGj0zwhIw_Dn_vwHxA'

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

    // --- 1. CEK DATA GANDA (VERSI ANTI-ERROR) ---
    // Kita gunakan filter yang lebih eksplisit
   // --- 1. CEK DATA GANDA (VERSI FIX ANTI-ERROR) ---
    const { data: userLama, error: checkError } = await supabase
      .from('members')
      .select('username, nomor_whatsapp, nomor_rekening')
      // WAJIB pakai tanda kutip dua (") agar data dibaca sebagai TEXT, bukan KOLOM
      .or(`username.eq."${username}",nomor_whatsapp.eq."${whatsapp}",nomor_rekening.eq."${nomorRekening}"`)
      .maybeSingle();

    if (checkError) {
      console.error("Supabase Check Error:", checkError.message);
      throw new Error(checkError.message);
    }

    if (userLama) {
      let pesan = "Data sudah terdaftar!";
      if (userLama.username === username) pesan = "Username sudah digunakan!";
      else if (userLama.nomor_whatsapp === whatsapp) pesan = "Nomor WhatsApp sudah ada!";
      else if (userLama.nomor_rekening === nomorRekening) pesan = "Nomor Rekening sudah ada!";
      
      return NextResponse.json({ success: false, message: pesan }, { status: 400 });
    }

    // --- 2. SIMPAN DATA (PASTIKAN NAMA KOLOM PAS) ---
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
          status: "AKTIF" 
        }
      ]);

    if (insertError) throw insertError;

    return NextResponse.json({ success: true, message: "Pendaftaran Berhasil!" }, { status: 200 });

  } catch (error) {
    console.error("DETEKSI ERROR REGISTER:", error.message);
    return NextResponse.json({ 
      success: false, 
      message: "Gagal: " + error.message 
    }, { status: 500 });
  }
}

