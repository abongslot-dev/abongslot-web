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

    // 2. Upsert (Update if exists, Insert if not) di Supabase
    // Syarat: Di tabel 'togel_results' kamu harus punya 'periode' atau 'pasaran' sebagai Unique Key
    const { error } = await supabase
      .from('togel_results')
      .upsert({ 
        pasaran, 
        periode, 
        result, 
        tanggal: new Date().toISOString() 
      }, { onConflict: 'periode' }); // Menggantikan 'ON DUPLICATE KEY'

    if (error) throw error;
    
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error Supabase:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


