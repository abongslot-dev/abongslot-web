import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('togel_results')
      .select('*')
      // 1. Urutkan berdasarkan ID agar urutan input tidak meleset
      .order('id', { ascending: false }) 
      // 2. Naikkan limit ke 1000 atau lebih agar riwayat lama terbaca
      .limit(1000); 

    if (error) throw error;
    return NextResponse.json({ success: true, data: data });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}