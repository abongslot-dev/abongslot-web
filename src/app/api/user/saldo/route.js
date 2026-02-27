export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// 1. Hubungkan ke Supabase (Pusat Data)
const SUPABASE_URL = 'https://hqsahuywehlbwywyzlsz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_PiwkCSc05QG4DjULYyUjTw_0R1uUux6';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json({ success: false, message: "Username kosong" }, { status: 400 });
    }

    // 2. Ambil data asli dari tabel 'members' Supabase
    const { data, error } = await supabase
      .from('members')
      .select('saldo, nama_bank, nama_rekening, nomor_rekening')
      .eq('username', username)
      .maybeSingle();

    if (error) {
      console.error("Supabase Error:", error.message);
      return NextResponse.json({ success: false, message: "Database Error" }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ success: false, message: "User tidak ditemukan" });
    }

    // 3. Kirim data asli ke Frontend
    return NextResponse.json({ 
      success: true, 
      saldo: parseFloat(data.saldo || 0),
      user: {
        nama_bank: data.nama_bank, 
        nama_rekening: data.nama_rekening, 
        nomor_rekening: data.nomor_rekening
      }
    });

  } catch (error) {
    console.error("Server Error:", error.message);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}
