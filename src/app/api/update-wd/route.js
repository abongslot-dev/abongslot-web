export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; 

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- 1. POST: Menerima / Menolak Withdraw ---
export async function POST(req) {
  try {
    const body = await req.json();
    
    const id = body.id; 
    const status = body.status;
    const processed_by = body.processed_by || 'ADMIN'; // <--- TANGKAP NAMA ADMIN

    if (!id || !status) {
      return NextResponse.json({ success: false, message: "ID atau Status tidak lengkap" });
    }

    // Update status dan kolom processed_by di database
    const { error } = await supabase
      .from('withdrawals')
      .update({ 
        status: status, 
        processed_by: processed_by, // <--- SIMPAN NAMA ADMIN KE KOLOM BARU
        processed_at: new Date().toISOString() 
      })
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("WD Update Error:", error.message);
    return NextResponse.json({ 
      success: false, 
      message: "Gagal update: " + error.message 
    }, { status: 500 });
  }
}

// --- 2. GET: Rangkuman Riwayat Withdraw ---
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('withdrawals')
      .select('*')
      .neq('status', 'PENDING') // Ambil yang sukses/reject saja
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Tambahan: Hitung total nominal (bisa difilter per hari di frontend)
    const totalAll = (data || []).reduce((sum, item) => sum + Number(item.nominal || 0), 0);

    return NextResponse.json({ 
      success: true, 
      data: data || [], 
      totalAll 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}