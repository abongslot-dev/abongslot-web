export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// 1. Hubungkan ke Supabase (Pusat Data Cloud)
const SUPABASE_URL = 'https://hqsahuywehlbwywyzlsz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_PiwkCSc05QG4DjULYyUjTw_0R1uUux6';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function GET() {
  try {
    // 2. Ambil data dari tabel 'togel_results' di Supabase
    // Kita ambil id, pasaran, periode, result, tanggal, dan created_at
    const { data, error } = await supabase
      .from('togel_results')
      .select('id, pasaran, periode, result, tanggal, created_at')
      .order('tanggal', { ascending: false })
      .order('periode', { ascending: false });

    if (error) {
      console.error("Supabase Error:", error.message);
      throw error;
    }

    // 3. Kirim data ke Frontend
    return NextResponse.json({ success: true, data: data || [] });

  } catch (error) {
    console.error("API Error Riwayat Keluaran:", error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
