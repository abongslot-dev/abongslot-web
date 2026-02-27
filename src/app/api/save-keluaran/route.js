export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// 1. Koneksi Supabase
const SUPABASE_URL = 'https://hqsahuywehlbwywyzlsz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_PiwkCSc05QG4DjULYyUjTw_0R1uUux6';
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
