import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic';

const SUPABASE_URL = 'https://hqsahuywehlbwywyzlsz.supabase.co'
const SUPABASE_KEY = 'sb_secret_oAmh3QwRBQivTeGj0zwhIw_Dn_vwHxA'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
  global: {
    fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }),
  },
})

export async function POST(req) {
  try {
    const body = await req.json();
    const { field, value } = body;

    if (!field || !value) return NextResponse.json({ exists: false });

    // 1. Mapping Kolom (Pastikan TIDAK ADA TYPO)
    let columnName = field;
    if (field === "whatsapp") columnName = "nomor_whatsapp";
    if (field === "nomorRekening") columnName = "nomor_rekening";
    if (field === "username") columnName = "username";

    // 2. Bersihkan Value
    const cleanValue = value.toString().trim();

    // 3. Eksekusi Query ke Supabase
    const { data, error } = await supabase
      .from('members')
      .select('username')
      .eq(columnName, cleanValue) // Mencari data yang pas
      .maybeSingle();

    if (error) {
      // Jika masih error, coba paksa pencarian tanpa filter ketat (Gunakan .filter)
      console.error("Supabase Error detail:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ exists: !!data });

  } catch (error) {
    console.error("Critical Error:", error.message);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
