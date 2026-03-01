import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// 1. Hubungkan ke Supabase (Pintu Gerbang)
const SUPABASE_URL = 'https://hqsahuywehlbwywzylsz.supabase.co'
const SUPABASE_KEY = 'sb_publishable_PiwkCSc05QG4DjULYyUjTw_0R1uUux6'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export async function POST(req) {
  try {
    const body = await req.json();
    
    // 2. Tangkap data dari form deposit
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

    // 3. Masukkan data ke tabel 'deposits' di Supabase
    const { data, error } = await supabase
      .from('deposits')
      .insert([
        { 
          username, 
          nominal: parseFloat(nominal), // Pastikan angka bukan teks
          promo, 
          bank_pengirim, 
          rek_pengirim, 
          nama_pengirim, 
          bank_tujuan, 
          rek_tujuan, 
          nama_tujuan,
          status: 'pending' // Status otomatis awal
        }
      ]);

    if (error) {
      console.error("Supabase Error:", error.message);
      return NextResponse.json({ error: "Gagal simpan: " + error.message }, { status: 500 });
    }

    // 4. Respon sukses ke user
    return NextResponse.json({ message: "Deposit Berhasil Dicatat, Boss! Mohon ditunggu." }, { status: 200 });

  } catch (error) {
    console.error("API ERROR DEPOSIT:", error.message);
    return NextResponse.json({ error: "Server Error: " + error.message }, { status: 500 });
  }
}

