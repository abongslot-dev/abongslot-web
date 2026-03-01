export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// 1. Koneksi Supabase
// 1. Pastikan ambil dari Environment Variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 2. Inisialisasi (Cukup sekali saja di setiap file)
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function POST(req) {
  try {
    const data = await req.json();
    const { pasaran, periode, result } = data;

    // --- PERBAIKAN DI SINI ---
    // Gunakan array ['pasaran', 'periode'] karena di SQL Bos uniknya gabungan keduanya
  const { error } = await supabase
  .from('togel_results')
  .upsert({ 
    pasaran, 
    periode, 
    result, 
    tanggal: new Date().toISOString().split('T')[0] 
  }, { 
    onConflict: 'pasaran,periode',
    ignoreDuplicates: false // Pastikan ini jika ingin menimpa data lama
  });

    if (error) throw error;
    
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error Supabase:", error.message);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      hint: "Pastikan kolom pasaran & periode di DB sudah unik" 
    }, { status: 500 });
  }
}



