import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';


const generateRandomCode = (length = 6) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};





// Mengambil kunci dari Environment Variables Vercel yang sudah kita pasang tadi
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, password, whatsapp, bank, namaRekening, nomorRekening, referral } = body;

    // --- 1. VALIDASI DATA GANDA (Pindah dari MySQL ke Supabase) ---
    const { data: existingUsers, error: checkError } = await supabase
      .from('members')
      .select('username, nomor_whatsapp, nomor_rekening')
      .or(`username.eq."${username}",nomor_whatsapp.eq."${whatsapp}",nomor_rekening.eq."${nomorRekening}"`)
      .maybeSingle();

    if (checkError) {
      console.error("Supabase Check Error:", checkError.message);
      return NextResponse.json({ success: false, message: "Database Error: " + checkError.message }, { status: 500 });
    }

    if (existingUsers) {
      let pesanError = "Data sudah terdaftar!";
      if (existingUsers.username === username) pesanError = "Username sudah digunakan!";
      else if (existingUsers.nomor_whatsapp === whatsapp) pesanError = "Nomor WhatsApp sudah terdaftar!";
      else if (existingUsers.nomor_rekening === nomorRekening) pesanError = "Nomor Rekening sudah terdaftar!";

      return NextResponse.json({ success: false, message: pesanError }, { status: 400 });
    }
    const myNewReferralCode = generateRandomCode(8);
    // --- 2. QUERY INSERT (Pindah dari MySQL ke Supabase) ---
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
          saldo: 0,
          upline: referral || null, // 2. MASUKKAN KE KOLOM 'upline' DI DATABASE 
          kode_referral: myNewReferralCode // <--- MASUK KE DATABASE DISINI
        }
      ]);

if (insertError) {
      console.error("Insert Error:", insertError.message);
      return NextResponse.json({ success: false, message: "Gagal simpan ke database" }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Pendaftaran Berhasil!",
      referralCode: myNewReferralCode // (Opsional) Kasih tau member kodenya apa
    }, { status: 200 });

  } catch (error) {
    console.error("Critical Error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}
