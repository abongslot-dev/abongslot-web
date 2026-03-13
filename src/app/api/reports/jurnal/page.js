export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request) {
  // 1. CEK VARIABLE (Penyebab utama error 500)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ 
      success: false, 
      message: "Variabel Supabase tidak terbaca di Vercel! Cek Settings Env." 
    }, { status: 200 }); // Paksa 200 biar ga crash
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // 2. AMBIL DATA PALING SEDERHANA
    const { data: depo, error: errDepo } = await supabase.from('deposits').select('nominal, status, created_at').limit(10);
    const { data: wd, error: errWd } = await supabase.from('withdrawals').select('nominal, status, created_at').limit(10);

    if (errDepo || errWd) {
      return NextResponse.json({ 
        success: false, 
        message: "Tabel tidak ditemukan atau kolom salah!", 
        error: errDepo?.message || errWd?.message 
      }, { status: 200 });
    }

    // 3. KIRIM DATA APA ADANYA DULU (Untuk Tes)
    // Jika ini muncul di layar, berarti koneksi sudah aman.
    return NextResponse.json({ 
      success: true, 
      data: [], // Kita kosongkan dulu untuk tes koneksi
      debug: "Koneksi Berhasil!" 
    });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: "Fatal Error: " + error.message 
    }, { status: 200 });
  }
}