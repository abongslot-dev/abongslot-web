import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const SUPABASE_URL = 'https://hqsahuywehlbwywyzlsz.supabase.co'
const SUPABASE_KEY = 'sb_publishable_PiwkCSc05QG4DjULYyUjTw_0R1uUux6'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// --- 1. GET (Ambil daftar deposit pending) ---
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('deposits')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ success: true, requests: data });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// --- 2. PATCH (Approve atau Reject Deposit) ---
export async function PATCH(req) {
  try {
    const { transactionId, status, amount, username } = await req.json();
    
    const isMenerima = ['SUCCESS', 'APPROVE', 'APPROVED'].includes(status.toUpperCase());
    const finalStatus = isMenerima ? 'SUCCESS' : 'REJECTED';

    // A. Update status di tabel deposits
    const { data: updatedDepo, error: errDepo } = await supabase
      .from('deposits')
      .update({ status: finalStatus, processed_at: new Date().toISOString() })
      .eq('id', transactionId)
      .eq('status', 'pending') // Keamanan: hanya yang masih pending yang bisa diupdate
      .select();

    if (errDepo || updatedDepo.length === 0) {
      return NextResponse.json({ success: false, message: "Data tidak ditemukan atau sudah diproses!" });
    }

    // B. Tambah saldo ke tabel members jika SUCCESS
    if (finalStatus === 'SUCCESS') {
      // 1. Ambil saldo lama dulu
      const { data: userData, error: errUser } = await supabase
        .from('members')
        .select('saldo')
        .eq('username', username)
        .single();

      if (!errUser && userData) {
        const saldoBaru = parseFloat(userData.saldo) + parseFloat(amount);
        
        // 2. Update saldo baru
        await supabase
          .from('members')
          .update({ saldo: saldoBaru })
          .eq('username', username);
      }
    }

    return NextResponse.json({ success: true, message: "Berhasil Update ke Supabase!" });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
