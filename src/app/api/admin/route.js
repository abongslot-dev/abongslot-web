export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// 1. Hubungkan ke Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const target = searchParams.get('target');

    // TARGET: DAFTAR MEMBER
    if (target === 'members') {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('id', { ascending: false });
      if (error) throw error;
      return NextResponse.json(data);
    }

    // TARGET: DEPOSIT PENDING
    if (target === 'deposits-pending') {
      const { data, error } = await supabase
        .from('deposits')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return NextResponse.json(data);
    }

    // TARGET: RIWAYAT DEPOSIT (SEMUA YANG BUKAN PENDING)
    if (target === 'deposits-history') {
      const { data, error } = await supabase
        .from('deposits')
        .select('*')
        .neq('status', 'pending')
        .order('created_at', { ascending: false });
      
      if (error) throw error;

      const cleanedData = data.map(row => ({
        ...row,
        nominal: row.nominal || 0,
        bonus: row.bonus || 0,
        total_deposit: Number(row.nominal || 0) + Number(row.bonus || 0)
      }));

      return NextResponse.json(cleanedData);
    }

    return NextResponse.json({ error: "Target tidak valid" }, { status: 400 });
  } catch (error) {
    console.error("ADMIN GET ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// LOGIK UPDATE STATUS (APPROVE/REJECT)
export async function PATCH(request) {
  try {
    const body = await request.json();
    const tId = body.transactionId || body.id;
    const tNominal = body.amount || body.nominal; 
    const { username, status } = body;

    if (!tId) return NextResponse.json({ success: false, error: "ID Kosong" });

    // Tentukan status akhir
    const isMenerima = status === 'SUCCESS' || status === 'APPROVE';
    const finalStatus = isMenerima ? 'SUCCESS' : 'REJECTED';

    // 1. Update Status Deposit di Supabase
    const { error: updateError } = await supabase
      .from('deposits')
      .update({ status: finalStatus })
      .eq('id', tId);

    if (updateError) throw updateError;

    // 2. Update Saldo Member (Hanya jika SUCCESS)
    if (finalStatus === 'SUCCESS') {
      // Ambil saldo lama
      const { data: userData, error: userError } = await supabase
        .from('members')
        .select('saldo')
        .eq('username', username)
        .single();

      if (userData) {
        const saldoBaru = Number(userData.saldo || 0) + Number(tNominal);
        
        // Simpan saldo baru
        await supabase
          .from('members')
          .update({ saldo: saldoBaru })
          .eq('username', username);
      }
    }

    return NextResponse.json({ success: true, message: `Berhasil di-${finalStatus}` });

  } catch (error) {
    console.error("PATCH ERROR:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

