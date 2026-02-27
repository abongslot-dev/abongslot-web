import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// 1. Hubungkan ke Supabase (Pastikan URL & Key sudah benar)
const SUPABASE_URL = 'https://hqsahuywehlbwywyzlsz.supabase.co'
const SUPABASE_KEY = 'sb_publishable_PiwkCSc05QG4DjULYyUjTw_0R1uUux6'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export async function POST(req) {
  try {
    const { field, value } = await req.json();

    // 2. Sesuaikan nama field dari frontend ke kolom tabel 'members' di Supabase
    let columnName = field;
    if (field === "whatsapp") columnName = "nomor_whatsapp";
    if (field === "nomorRekening") columnName = "nomor_rekening";
    if (field === "username") columnName = "username";

    // 3. Cek data di Supabase (Mirip SELECT id FROM members)
    const { data, error } = await supabase
      .from('members')
      .select('id')
      .eq(columnName, value)
      .maybeSingle();

    if (error) {
      console.error("Supabase Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 4. Kirim jawaban: true jika ada, false jika kosong (tersedia)
    return NextResponse.json({ exists: !!data });

  } catch (error) {
    console.error("Check Data Error:", error.message);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
