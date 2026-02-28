import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Pastikan nama variabel ini sama persis dengan yang Bos tulis di Settings Vercel
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hqsahuywehlbwywzylsz.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_oAmh3QwRBQivTeGj0zwhIw_Dn_vwHxA';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json({ success: false, message: "Username tidak disertakan" }, { status: 400 });
    }

    // Ambil data dari tabel 'members'
    const { data, error } = await supabase
      .from('members')
      .select('saldo, nama_bank, nama_rekening, nomor_rekening')
      .eq('username', username.trim())
      .maybeSingle();

    if (error) {
      console.error("Supabase Error:", error.message);
      return NextResponse.json({ success: false, message: "Database Error: " + error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ success: false, message: "User tidak ditemukan" }, { status: 404 });
    }

    // Pakai Number() atau parseFloat() agar saldo terbaca sebagai angka, bukan teks
    return NextResponse.json({ 
      success: true, 
      saldo: Number(data.saldo || 0),
      user: {
        nama_bank: data.nama_bank || "-",
        nama_rekening: data.nama_rekening || "-",
        nomor_rekening: data.nomor_rekening || "-"
      }
    });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
