export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const SUPABASE_URL = 'https://hqsahuywehlbwywyzlsz.supabase.co'
const SUPABASE_KEY = 'sb_publishable_PiwkCSc05QG4DjULYyUjTw_0R1uUux6'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export async function GET(req) {
  try {
    // 1. Ambil username dari parameter URL (misal: /api/profile?username=Sariwang)
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ error: "Username tidak ditemukan" }, { status: 400 });
    }

    // 2. Ambil data asli dari tabel 'members' di Supabase
    const { data, error } = await supabase
      .from('members')
      .select('nama_rekening, nomor_rekening, nama_bank, saldo')
      .eq('username', username)
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json({ error: "User tidak ditemukan di database" }, { status: 404 });
    }

    // 3. Kirim data asli ke halaman Profile
    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data: " + error.message }, { status: 500 });
  }
}
