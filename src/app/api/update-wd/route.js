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
    
    const { id, status, processed_by, admin_id } = body; // Tangkap data dari frontend

    if (!id || !status) {
      return NextResponse.json({ success: false, message: "ID atau Status tidak lengkap" });
    }

    // Masukkan data admin ke database
    const { error } = await supabase
      .from('withdrawals')
      .update({ 
        status: status, 
        processed_by: processed_by, // Nama Admin masuk ke sini
        admin_id: admin_id,         // ID Admin masuk ke sini
        processed_at: new Date().toISOString() 
      })
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
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