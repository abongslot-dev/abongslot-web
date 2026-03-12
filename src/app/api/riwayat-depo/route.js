export const dynamic = 'force-dynamic';
export const revalidate = 0; // Memastikan data tidak di-cache oleh Next.js

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Gunakan environment variables agar aman dan tidak bocor di kodingan
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Pakai Service Role di Backend agar tembus RLS
);

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json({ success: false, message: "Username required" }, { status: 400 });
    }

    // Ambil data riwayat deposit
    const { data, error } = await supabase
      .from('deposits')
      .select('id, created_at, nominal, bank_tujuan, rek_tujuan, nama_tujuan, status, promo') // Sebutkan kolomnya dengan jelas
      .eq('username', username)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      data: data || [] 
    });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}