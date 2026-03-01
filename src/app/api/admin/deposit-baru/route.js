import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// 1. Hubungkan ke Supabase menggunakan Service Role (Kunci Master)
// Pastikan variabel ini sudah diisi di Vercel Environment Variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

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
    console.error("GET Error:", error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// --- 2. PATCH (Approve atau Reject Deposit) ---
export async function PATCH(req) {
  try {
    const { transactionId, status, amount, username } = await req.json();
    
    // Normalisasi status
    const statusUpper = status ? status.toUpperCase() : '';
    const isMenerima = ['SUCCESS', 'APPROVE', 'APPROVED'].includes(statusUpper);
    const finalStatus = isMenerima ? 'SUCCESS' : 'REJECTED';

    // A. Update status di tabel deposits
    const { data: updatedDepo, error: errDepo } = await supabase
      .from('deposits')
      .update({ 
        status: finalStatus, 
        processed_at: new Date().toISOString() 
      })
      .eq('id', transactionId)
      .eq('status', 'pending') // Keamanan: pastikan masih pending
      .select();

    if (errDepo) throw errDepo;
    
    if (!updatedDepo || updatedDepo.length === 0) {
      return NextResponse.json({ success: false, message: "Data tidak ditemukan atau sudah diproses sebelumnya!" });
    }

    // B. Tambah saldo ke tabel members jika statusnya SUCCESS/APPROVE
    if (finalStatus === 'SUCCESS') {
      // 1. Ambil saldo lama (Service Role bisa tembus RLS)
      const { data: userData, error: errUser } = await supabase
        .from('members')
        .select('saldo')
        .eq('username', username)
        .single();

      if (errUser) {
        console.error("User not found or error:", errUser.message);
        // Tetap lanjut tapi beri peringatan, atau throw error jika wajib ada member
      }

      if (userData) {
        const saldoLama = parseFloat(userData.saldo) || 0;
        const tambahan = parseFloat(amount) || 0;
        const saldoBaru = saldoLama + tambahan;
        
        // 2. Update saldo baru ke database
        const { error: errUpdateSaldo } = await supabase
          .from('members')
          .update({ saldo: saldoBaru })
          .eq('username', username);

        if (errUpdateSaldo) throw errUpdateSaldo;
      }
    }

    return NextResponse.json({ success: true, message: `Berhasil di-${finalStatus} dan saldo diperbarui!` });

  } catch (error) {
    console.error("PATCH Error:", error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
