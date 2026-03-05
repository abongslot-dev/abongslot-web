export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// 1. GUNAKAN SERVICE ROLE KEY (WAJIB untuk Update Admin)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; 

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- 1. POST: Menerima / Menolak Withdraw ---
export async function POST(req) {
  try {
    const body = await req.json();
    
    // Gunakan ID apa adanya (UUID atau BigInt) - jangan paksa parseInt jika ID-nya UUID
    const id = body.id; 
    const status = body.status;

    if (!id || !status) {
      return NextResponse.json({ success: false, message: "ID atau Status tidak lengkap" });
    }

    // Update status di tabel withdrawals
    const { error } = await supabase
      .from('withdrawals')
      .update({ 
        status: status, 
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
    // Ambil data yang statusnya BUKAN 'PENDING'
    const { data, error } = await supabase
      .from('withdrawals')
      .select('*')
      .neq('status', 'PENDING')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Hitung total nominal menggunakan reduce
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
