import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic';

// Ambil variabel dari Vercel
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { field, value } = body;

    if (!field || !value) {
      return NextResponse.json({ exists: false });
    }

    // Mapping nama kolom agar sesuai dengan tabel 'members' di Supabase
    let columnName = field;
    if (field === "whatsapp") columnName = "nomor_whatsapp";
    if (field === "nomorRekening") columnName = "nomor_rekening";
    if (field === "username") columnName = "username";

    // Eksekusi cek ke Supabase
    const { data, error } = await supabase
      .from('members')
      .select('username')
      .eq(columnName, value.toString().trim())
      .maybeSingle();

    if (error) {
      console.error("Supabase Error:", error.message);
      // Kirim error detail agar kita tahu rusaknya dimana
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Jika data ada, berarti 'exists' adalah true
    return NextResponse.json({ exists: !!data });

  } catch (error) {
    console.error("Critical Error API Check:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
