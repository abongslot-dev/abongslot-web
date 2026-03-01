import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// 1. Ambil URL dan KEY dari Environment Variable (Lebih Aman)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL; 
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Pastikan Client hanya dibuat satu kali
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export async function POST(req) {
  try {
    const body = await req.json();
    
    const { 
      username, 
      nominal, 
      promo, 
      bank_pengirim, 
      rek_pengirim, 
      nama_pengirim,
      bank_tujuan, 
      rek_tujuan, 
      nama_tujuan 
    } = body;

    // 2. Masukkan data ke tabel 'deposits'
    const { data, error } = await supabase
      .from('deposits')
      .insert([
        { 
          username, 
          nominal: Number(nominal) || 0,
          promo: promo || 'No Promo',
          bank_pengirim, 
          rek_pengirim, 
          nama_pengirim, 
          bank_tujuan, 
          rek_tujuan, 
          nama_tujuan,
          status: 'pending'
        }
      ]);

    // 3. Cek apakah ada error dari Supabase
    if (error) {
      console.error("Supabase Error Detail:", error);
      return NextResponse.json({ error: "Gagal simpan: " + error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Deposit Berhasil Dicatat, Boss! Mohon ditunggu." }, { status: 200 });

  } catch (error) {
    console.error("API ERROR DEPOSIT:", error.message);
    return NextResponse.json({ error: "Server Error: " + error.message }, { status: 500 });
  }
}
