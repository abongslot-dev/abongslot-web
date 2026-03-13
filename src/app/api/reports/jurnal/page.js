export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export async function GET() {
  try {
    // Ambil semua data secara paralel agar cepat
    const [depo, wd, adj, promo, roll, reff] = await Promise.all([
      supabase.from('deposits').select('username, nominal, created_at').or('status.eq.approve,status.eq.success'),
      supabase.from('withdrawals').select('username, nominal, created_at').or('status.eq.SUCCESS,status.eq.success'),
      supabase.from('adjustments').select('username, nominal, type, reason, created_at'), // type: 'add' atau 'sub'
      supabase.from('promo_logs').select('username, bonus_amount, promo_name, created_at'),
      supabase.from('rollingan_logs').select('username, amount, created_at'),
      supabase.from('referral_logs').select('username, bonus_amount, from_referral, created_at')
    ]);

    // 1. Format Deposit
    const dataDepo = (depo.data || []).map(i => ({
      tanggal: i.created_at, username: i.username, kategori: 'DEPOSIT',
      keterangan: 'Deposit Sukses', masuk: parseFloat(i.nominal), keluar: 0
    }));

    // 2. Format Withdraw
    const dataWd = (wd.data || []).map(i => ({
      tanggal: i.created_at, username: i.username, kategori: 'WITHDRAW',
      keterangan: 'Withdraw Sukses', masuk: 0, keluar: parseFloat(i.nominal)
    }));

    // 3. Format Penyesuaian Saldo (Manual)
    const dataAdj = (adj.data || []).map(i => ({
      tanggal: i.created_at, username: i.username, kategori: 'ADJUSTMENT',
      keterangan: i.reason || 'Penyesuaian Saldo',
      masuk: i.type === 'add' ? parseFloat(i.nominal) : 0,
      keluar: i.type === 'sub' ? parseFloat(i.nominal) : 0
    }));

    // 4. Format Promo/Bonus
    const dataPromo = (promo.data || []).map(i => ({
      tanggal: i.created_at, username: i.username, kategori: 'PROMO',
      keterangan: `Bonus: ${i.promo_name}`, masuk: parseFloat(i.bonus_amount), keluar: 0
    }));

    // 5. Format Rollingan
    const dataRoll = (roll.data || []).map(i => ({
      tanggal: i.created_at, username: i.username, kategori: 'ROLLINGAN',
      keterangan: 'Pembagian Rollingan Mingguan', masuk: parseFloat(i.amount), keluar: 0
    }));

    // 6. Format Referral
    const dataReff = (reff.data || []).map(i => ({
      tanggal: i.created_at, username: i.username, kategori: 'REFERRAL',
      keterangan: `Bonus Reff dari: ${i.from_referral}`, masuk: parseFloat(i.bonus_amount), keluar: 0
    }));

    // GABUNG SEMUA & URUTKAN TANGGAL TERBARU
    const semuaJurnal = [
      ...dataDepo, ...dataWd, ...dataAdj, 
      ...dataPromo, ...dataRoll, ...dataReff
    ].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

    return NextResponse.json({ success: true, data: semuaJurnal });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}