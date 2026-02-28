import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic';

// Ambil variabel dari Vercel (Gunakan nama yang sesuai di Dashboard Vercel Bosku)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, password, whatsapp, bank, namaRekening, nomorRekening } = body;

    // --- 1. CEK DATA GANDA (VERSI FIX) ---
    // Gunakan tanda kutip %22 (double quote) atau biarkan Supabase handle per kolom agar tidak Error 500
    const { data: userLama, error: checkError } = await supabase
      .from('members')
      .select('username, nomor_whatsapp, nomor_rekening')
      .or(`username.eq."${username}",nomor_whatsapp.eq."${whatsapp}",nomor_rekening.eq."${nomorRekening}"`)
      .maybeSingle();

    if (checkError) {
      console.error("Supabase Check Error:", checkError.message);
      // Jika filter .or bermasalah, biasanya karena format string. 
      // Kita beri pesan yang jelas di console.
      throw new Error("Gagal verifikasi data ganda: " + checkError.message);
    }

    if (userLama) {
      let pesan = "Data sudah terdaftar!";
      if (userLama.username === username) pesan = "Username sudah digunakan!";
      else if (userLama.nomor_whatsapp === whatsapp) pesan = "Nomor WhatsApp sudah ada!";
      else if (userLama.nomor_rekening === nomorRekening) pesan = "Nomor Rekening sudah ada!";
      
      return NextResponse.json({ success: false, message: pesan }, { status: 400 });
    }

    // --- 2. SIMPAN DATA ---
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

    if (insertError) {
      console.error("Insert Error:", insertError.message);
      throw new Error("Gagal menyimpan ke database: " + insertError.message);
    }

    return NextResponse.json({ success: true, message: "Pendaftaran Berhasil!" }, { status: 200 });

  } catch (error) {
    console.error("DETEKSI ERROR REGISTER:", error.message);
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}
