export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// GUNAKAN SECRET KEY (SB_SECRET) BUKAN PUBLISHABLE
const SUPABASE_URL = 'https://hqsahuywehlbwywyzlsz.supabase.co';
const SUPABASE_KEY = 'sb_secret_oAmh3QwRBQivTeGj0zwhIw_Dn_vwHxA'; // Kunci Master kamu

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json({ success: false, message: "Username kosong" }, { status: 400 });
    }

    // Ambil data asli dari tabel 'members'
    const { data, error } = await supabase
      .from('members')
      .select('saldo, nama_bank, nama_rekening, nomor_rekening')
      .eq('username', username)
      .maybeSingle();

    if (error) {
      console.error("Supabase Error:", error.message);
      return NextResponse.json({ success: false, message: "Database Error: " + error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ success: false, message: "User tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      saldo: parseFloat(data.saldo || 0),
      user: {
        nama_bank: data.nama_bank, 
        nama_rekening: data.nama_rekening, 
        nomor_rekening: data.nomor_rekening
      }
    });

  } catch (error) {
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

