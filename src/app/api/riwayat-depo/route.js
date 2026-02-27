export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// 1. Hubungkan ke Supabase (Cloud Database)
const SUPABASE_URL = 'https://hqsahuywehlbwywyzlsz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_PiwkCSc05QG4DjULYyUjTw_0R1uUux6';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function GET(req) {
  try {
    // 2. Ambil username dari URL
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json({ success: false, message: "Username tidak ditemukan" }, { status: 400 });
    }

    // 3. Ambil riwayat deposit dari tabel 'deposits' di Supabase
    const { data, error } = await supabase
      .from('deposits')
      .select('*')
      .eq('username', username)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    // 4. Kirim data ke tampilan Frontend
    return NextResponse.json({ success: true, data: data || [] });

  } catch (error) {
    console.error("Riwayat Depo Error:", error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
