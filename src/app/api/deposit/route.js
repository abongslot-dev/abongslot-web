import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// 1. Inisialisasi Supabase dengan Service Role agar bisa bypass RLS jika perlu
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL; 
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
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
      nama_tujuan,
      processed_by // Nama Admin (Jika diisi oleh Admin)
    } = body;

    // Logika pembuatan Admin ID otomatis (Misal: RIYA | ABSLOT -> RIY)
    const adminId = processed_by 
      ? processed_by.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase() 
      : null;

    // 2. Masukkan data ke tabel 'deposits'
    const { data, error } = await supabase
      .from('deposits')
      .insert([
        { 
          username, 
          nominal: Number(nominal) || 0,
          promo: promo || 'Tanpa Promo',
          bank_pengirim: bank_pengirim?.toUpperCase(), 
          rek_pengirim, 
          nama_pengirim, 
          bank_tujuan: bank_tujuan?.toUpperCase(), 
          rek_tujuan, 
          nama_tujuan,
          status: 'pending', // Status awal selalu pending
          processed_by: processed_by || null, // Kosong jika diisi player
          admin_id: adminId, // Otomatis terisi jika ada processed_by
          created_at: new Date().toISOString() // Timestamp saat ini
        }
      ])
      .select(); // Mengembalikan data yang baru dimasukkan

    // 3. Cek Error Supabase
    if (error) {
      console.error("Supabase Error Detail:", error);
      return NextResponse.json(
        { success: false, message: "Gagal simpan ke Database: " + error.message }, 
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "Deposit Berhasil Dicatat, Boss! Mohon ditunggu.",
      data: data[0]
    }, { status: 200 });

  } catch (error) {
    console.error("API ERROR DEPOSIT:", error.message);
    return NextResponse.json(
      { success: false, message: "Server Error: " + error.message }, 
      { status: 500 }
    );
  }
}