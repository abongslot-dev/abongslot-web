import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic';

const SUPABASE_URL = 'https://hqsahuywehlbwywyzlsz.supabase.co'
const SUPABASE_KEY = 'sb_secret_oAmh3QwRBQivTeGj0zwhIw_Dn_vwHxA'

// 1. Buat Client Supabase
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

    // 2. Mapping Kolom (Harus di atas sebelum dipakai)
    let columnName = field;
    if (field === "whatsapp") columnName = "nomor_whatsapp";
    if (field === "nomorRekening") columnName = "nomor_rekening";
    if (field === "username") columnName = "username";

    const cleanValue = value.toString().trim();

    // 3. Query pakai Supabase (BUKAN MySQL connection.execute)
    const { data, error } = await supabase
      .from('members')
      .select('username')
      .eq(columnName, cleanValue)
      .maybeSingle();

    if (error) {
      console.error("Supabase Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 4. Kirim respon ke frontend
    return NextResponse.json({ exists: !!data });

  } catch (error) {
    console.error("Critical Error:", error.message);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
