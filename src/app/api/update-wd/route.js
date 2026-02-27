export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const SUPABASE_URL = 'https://hqsahuywehlbwywyzlsz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_PiwkCSc05QG4DjULYyUjTw_0R1uUux6';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- 1. POST: Menerima / Menolak Withdraw ---
export async function POST(req) {
  try {
    const body = await req.json();
    const id = parseInt(body.id);
    const status = body.status;

    const { error } = await supabase
      .from('withdrawals')
      .update({ 
        status: status, 
        processed_at: new Date().toISOString() // Simpan waktu sekarang
      })
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// --- 2. GET: Rangkuman Riwayat Withdraw ---
export async function GET() {
  try {
    // Ambil data yang statusnya BUKAN 'PENDING'
    const { data, error } = await supabase
      .from('withdrawals')
      .select('*')
      .neq('status', 'PENDING')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Hitung total nominal (reduce data)
    const totalAll = (data || []).reduce((sum, item) => sum + Number(item.nominal || 0), 0);

    return NextResponse.json({ success: true, data: data || [], totalAll });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
