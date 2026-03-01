export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// 1. GUNAKAN SERVICE ROLE KEY (WAJIB untuk Update/Delete di Server)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; 

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    
    // A. LOGIKA INSERT DATA BARU (Jika ID tidak ada)
    if (!body.id) {
      const { error: insErr } = await supabase
        .from('deposits')
        .insert([{ 
          username: body.username, 
          nominal: parseFloat(body.nominal) || 0, 
          bank_tujuan: body.bank_tujuan || '',
          status: 'pending' 
        }]);

      if (insErr) throw insErr;
      return NextResponse.json({ success: true });
    }

    // B. LOGIKA UPDATE STATUS (ADMIN)
    const rawStatus = body.status?.toLowerCase();
    const finalStatus = (rawStatus === 'success' || rawStatus === 'approve' || rawStatus === 'approved') ? 'approve' : 'reject';

    // 1. Update Status Deposit
    const { error: updErr } = await supabase
      .from('deposits')
      .update({ 
        status: finalStatus, 
        processed_at: new Date().toISOString() 
      })
      .eq('id', body.id);

    if (updErr) throw updErr;

    // 2. Tambah Saldo Member jika status 'approve'
    if (finalStatus === 'approve') {
      const { data: userData, error: userErr } = await supabase
        .from('members')
        .select('saldo')
        .eq('username', body.username)
        .single();

      if (userErr && userErr.code !== 'PGRST116') throw userErr;

      if (userData) {
        const saldoLama = parseFloat(userData.saldo) || 0;
        const tambahan = parseFloat(body.nominal) || 0;
        const saldoBaru = saldoLama + tambahan;
        
        const { error: balanceErr } = await supabase
          .from('members')
          .update({ saldo: saldoBaru })
          .eq('username', body.username);

        if (balanceErr) throw balanceErr;
      }
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("❌ ERROR DETECTED:", error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('deposits')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data: data });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
