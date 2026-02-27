export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// 1. Hubungkan ke Supabase (Pusat Data Cloud)
const SUPABASE_URL = 'https://hqsahuywehlbwywyzlsz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_PiwkCSc05QG4DjULYyUjTw_0R1uUux6';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function GET(request) {
  try {
    // 2. Ambil username dari URL
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json({ success: false, message: "Username tidak terdeteksi" });
    }

    // 3. Ambil data dari tabel 'withdrawals' di Supabase
    // Kita filter berdasarkan username dan status yang bukan PENDING
    const { data, error } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('username', username)
      .neq('status', 'PENDING')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error) {
    console.error("Riwayat WD Error:", error.message);
    return NextResponse.json({ success: false, message: error.message, data: [] });
  }
}
