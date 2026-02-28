export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// 1. Hubungkan ke Supabase (Pusat Data Cloud)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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

