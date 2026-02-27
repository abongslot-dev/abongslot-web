import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// 1. Hubungkan ke Supabase
const SUPABASE_URL = 'https://hqsahuywehlbwywyzlsz.supabase.co'
const SUPABASE_KEY = 'sb_secret_oAmh3QwRBQivTeGj0zwhIw_Dn_vwHxA'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, password, whatsapp, bank, namaRekening, nomorRekening } = body;

    // 2. VALIDASI DATA GANDA (Cek apakah sudah ada di Supabase)
    const { data: existingUsers, error: checkError } = await supabase
      .from('members')
      .select('username, nomor_whatsapp, nomor_rekening')
      .or(`username.eq.${username},nomor_whatsapp.eq.${whatsapp},nomor_rekening.eq.${nomorRekening}`);

    if (checkError) throw checkError;

    if (existingUsers && existingUsers.length > 0) {
      const userLama = existingUsers[0];
      let pesanError = "Data sudah terdaftar!";

      if (userLama.username === username) pesanError = "Username sudah digunakan!";
      else if (userLama.nomor_whatsapp === whatsapp) pesanError = "Nomor WhatsApp sudah terdaftar!";
      else if (userLama.nomor_rekening === nomorRekening) pesanError = "Nomor Rekening sudah terdaftar!";

      return NextResponse.json({ success: false, message: pesanError }, { status: 400 });
    }

    // 3. Insert Data Member Baru
    const { error: insertError } = await supabase
      .from('members')
      .insert([
        { 
          username, 
          password, 
          nomor_whatsapp: whatsapp, 
          nama_bank: bank, 
          nama_rekening: namaRekening, 
          nomor_rekening: nomorRekening, 
          saldo: 0 
        }
      ]);

    if (insertError) throw insertError;

    return NextResponse.json({ 
      success: true, 
      message: "Pendaftaran Berhasil! Silakan Login." 
    }, { status: 200 });

  } catch (error) {
    console.error("Register Error:", error.message);
    return NextResponse.json({ 
      success: false, 
      message: "Gagal daftar: " + error.message 
    }, { status: 500 });
  }
}

