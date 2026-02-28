import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// WAJIB: Biar Vercel gak pakai data lama (cache)
export const dynamic = 'force-dynamic';

const SUPABASE_URL = 'https://hqsahuywehlbwywyzlsz.supabase.co'
const SUPABASE_KEY = 'sb_secret_oAmh3QwRBQivTeGj0zwhIw_Dn_vwHxA'

// FIX: Tambahkan opsi fetch agar stabil di server Vercel
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

    if (!field || !value) {
      return NextResponse.json({ exists: false });
    }

    // 2. Mapping kolom (Sudah benar, kita rapikan sedikit)
    let columnName = field;
    if (field === "whatsapp") columnName = "nomor_whatsapp";
    if (field === "nomorRekening") columnName = "noming_rekening"; // Cek typo: nomor_rekening atau noming_rekening?
    if (field === "username") columnName = "username";

    // 3. Eksekusi Cek ke Supabase
    const { data, error } = await supabase
      .from('members')
      .select('username') // Ambil kolom ringan saja
      .eq(columnName, value.toString().trim())
      .maybeSingle();

    if (error) {
      console.error("Supabase Error detail:", error.message);
      // Jika error karena kolom tidak ada, ini akan ketahuan di log Vercel
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ exists: !!data });

  } catch (error) {
    console.error("Check Data Critical Error:", error.message);
    return NextResponse.json({ error: "Server Error: " + error.message }, { status: 500 });
  }
}
