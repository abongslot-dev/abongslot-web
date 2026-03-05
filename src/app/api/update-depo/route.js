export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    
    // A. LOGIKA INSERT (FORM DEPOSIT USER)
    if (!body.id) {
      const { error: insErr } = await supabase
        .from('deposits')
        .insert([{ 
          username: body.username?.trim(), // Bersihkan spasi hantu
          nominal: parseFloat(body.nominal) || 0, 
          bank_tujuan: body.bank_tujuan || '',
          status: 'pending' 
        }]);

      if (insErr) throw insErr;
      return NextResponse.json({ success: true });
    }

    // B. LOGIKA UPDATE STATUS (ADMIN)
    const rawStatus = body.status?.toLowerCase();
    // Kita samakan standarnya: 'approve' atau 'reject'
    const finalStatus = (rawStatus === 'success' || rawStatus === 'approve' || rawStatus === 'approved') ? 'approve' : 'reject';

    // 1. Update Status Deposit & Tanggal Proses
    const { error: updErr } = await supabase
      .from('deposits')
      .update({ 
        status: finalStatus, 
        processed_at: new Date().toISOString() 
      })
      .eq('id', body.id);

    if (updErr) throw updErr;

    // 2. Tambah Saldo Member (Jika Approve)
    if (finalStatus === 'approve') {
      const cleanUsername = body.username?.trim(); // PENTING!

      // Ambil saldo terakhir dari DB (Bukan dari input body biar akurat)
      const { data: userData, error: userErr } = await supabase
        .from('members')
        .select('saldo')
        .eq('username', cleanUsername)
        .maybeSingle(); // Lebih aman daripada .single()

      if (userErr) throw userErr;

      if (userData) {
        const saldoLama = parseFloat(userData.saldo) || 0;
        const tambahan = parseFloat(body.nominal) || 0;
        const saldoBaru = saldoLama + tambahan;
        
        const { error: balanceErr } = await supabase
          .from('members')
          .update({ saldo: saldoBaru })
          .eq('username', cleanUsername);

        if (balanceErr) throw balanceErr;
      } else {
        // Jika username tidak ditemukan di tabel members
        return NextResponse.json({ success: false, message: "Username member tidak ditemukan!" }, { status: 404 });
      }
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("❌ ERROR DETECTED:", error.message);
    // Kita kirim pesan error aslinya biar Bos tahu kolom mana yang kurang
    return NextResponse.json({ success: false, message: "Database Error: " + error.message }, { status: 500 });
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
