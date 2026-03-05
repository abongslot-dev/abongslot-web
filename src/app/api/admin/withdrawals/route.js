export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// 1. Inisialisasi Supabase
// 1. GUNAKAN SERVICE ROLE KEY (WAJIB di file API Admin agar RLS Terlewati)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; 

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function GET() {
  try {
    // 2. Ambil data WD yang statusnya PENDING dari Supabase
    const { data, error } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('status', 'PENDING')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Supabase Error:", error.message);
      throw error;
    }

    // 3. Kirim balik data ke dashboard admin
    return NextResponse.json({ 
      success: true, 
      requests: data || [] 
    });

  } catch (error) {
    console.error("ERROR API ADMIN WD:", error.message);
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}

