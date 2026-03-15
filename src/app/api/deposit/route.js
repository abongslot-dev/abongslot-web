import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL; 
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export async function POST(req) {
  try {
    const body = await req.json();
    
    // --- CEK APAKAH INI UPDATE (ADMIN) ATAU INSERT (PLAYER) ---
    // Jika ada 'id' di body, berarti Admin sedang memproses data yang sudah ada
    if (body.id) {
      const { id, status, processed_by, username, nominal } = body;
      
      // Logika Admin ID: Ambil 3 huruf depan (Contoh: RIYA | ABSLOT -> RIY)
      const adminId = processed_by 
        ? processed_by.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase() 
        : 'ADM';

      // Pastikan status yang masuk ke DB adalah 'approve' atau 'reject' (huruf kecil)
      const finalStatus = (status === 'SUCCESS' || status === 'approve') ? 'approve' : 'reject';

      // 1. Update Tabel Deposits
      const { error: updErr } = await supabase
        .from('deposits')
        .update({ 
          status: finalStatus,
          processed_by: processed_by,
          admin_id: adminId,
          processed_at: new Date().toISOString()
        })
        .eq('id', id);

      if (updErr) throw new Error("Gagal Update Deposit: " + updErr.message);

      // 2. Jika APPROVE, Tambah Saldo Member
    if (finalStatus === 'approve') {
  // PAKAI TRIK INI BOS: Paksa jadi string dan kasih default kosong ""
  // Biar gak muncul error "trim is not a function" lagi
  const cleanUsername = String(body.username || "").trim();
  const nominalAngka = parseFloat(body.nominal) || 0;

  if (cleanUsername && nominalAngka > 0) {
    // 1. Ambil data member
    const { data: userData, error: userErr } = await supabase
      .from('members')
      .select('saldo')
      .eq('username', cleanUsername)
      .maybeSingle();

    if (userErr) {
      console.error("Gagal cek member:", userErr.message);
    } else if (userData) {
      // 2. Hitung saldo baru
      const saldoLama = parseFloat(userData.saldo) || 0;
      const saldoBaru = saldoLama + nominalAngka;

      // 3. Update saldo ke database
      const { error: balanceErr } = await supabase
        .from('members')
        .update({ saldo: saldoBaru })
        .eq('username', cleanUsername);

      if (balanceErr) console.error("Gagal update saldo:", balanceErr.message);
    } else {
      console.warn(`Username ${cleanUsername} tidak ditemukan di tabel members.`);
    }
  }
}

      return NextResponse.json({ success: true, message: "Berhasil di-update oleh " + processed_by });
    }

    // --- LOGIKA INSERT (PLAYER KIRIM FORM) ---
    const { 
      username, nominal, promo, bank_pengirim, rek_pengirim, 
      nama_pengirim, bank_tujuan, rek_tujuan, nama_tujuan 
    } = body;

    const { data, error: insErr } = await supabase
      .from('deposits')
      .insert([
        { 
          username, 
          nominal: Number(nominal) || 0,
          promo: promo || 'Tanpa Promo',
          bank_pengirim: bank_pengirim?.toUpperCase(), 
          rek_pengirim, 
          nama_pengirim, 
          bank_tujuan: bank_tujuan?.toUpperCase(), 
          rek_tujuan, 
          nama_tujuan,
          status: 'pending',
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (insErr) throw insErr;

    return NextResponse.json({ 
      success: true, 
      message: "Deposit Berhasil Dicatat!",
      data: data[0]
    });

  } catch (error) {
    console.error("API ERROR:", error.message);
    return NextResponse.json(
      { success: false, message: error.message }, 
      { status: 500 }
    );
  }
}