export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    // Helper Query agar tidak berulang
    const getData = async (table, selectStr, filter = null) => {
      let q = supabase.from(table).select(selectStr);
      if (from && to) {
        q = q.gte('created_at', `${from}T00:00:00.000Z`).lte('created_at', `${to}T23:59:59.999Z`);
      }
      if (filter) q = q.or(filter);
      const { data } = await q;
      return data || [];
    };

    // Ambil semua data (Safe mode: jika tabel ga ada/kosong, tetap jalan)
    const [deposits, withdrawals, adjustments, promos, rollings, referrals] = await Promise.all([
      getData('deposits', 'nominal, created_at, status', 'status.eq.approve,status.eq.success'),
      getData('withdrawals', 'nominal, created_at, status', 'status.eq.SUCCESS,status.eq.success'),
      getData('adjustments', 'nominal, type, created_at'),
      getData('promo_logs', 'bonus_amount, created_at'),
      getData('rollingan_logs', 'amount, created_at'),
      getData('referral_logs', 'bonus_amount, created_at')
    ]);

    const reportMap = {};

    const getEntry = (date) => {
      const d = new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
      if (!reportMap[d]) {
        reportMap[d] = {
          tanggal: d, depo: 0, wd: 0, adjPlus: 0, adjMin: 0,
          bonus: 0, cashback: 0, referral: 0, rolling: 0, marketing: 0, total: 0
        };
      }
      return reportMap[d];
    };

    // Mapping Data
    deposits.forEach(i => getEntry(i.created_at).depo += parseFloat(i.nominal || 0));
    withdrawals.forEach(i => getEntry(i.created_at).wd += parseFloat(i.nominal || 0));
    adjustments.forEach(i => {
      const entry = getEntry(i.created_at);
      if (i.type === 'add') entry.adjPlus += parseFloat(i.nominal || 0);
      else entry.adjMin += parseFloat(i.nominal || 0);
    });
    promos.forEach(i => getEntry(i.created_at).bonus += parseFloat(i.bonus_amount || 0));
    rollings.forEach(i => getEntry(i.created_at).rolling += parseFloat(i.amount || 0));
    referrals.forEach(i => getEntry(i.created_at).referral += parseFloat(i.bonus_amount || 0));

    // Hitung Total & Format Ribuan
    const finalData = Object.values(reportMap).map(row => {
      const winLoss = (row.depo + row.adjPlus) - (row.wd + row.adjMin + row.bonus + row.cashback + row.referral + row.rolling);
      
      // Format angka sesuai gambar Bos (pakai titik ribuan dan koma desimal)
      const fmt = (v) => new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v);

      return {
        ...row,
        depo: fmt(row.depo),
        wd: fmt(row.wd),
        adjPlus: fmt(row.adjPlus),
        adjMin: fmt(row.adjMin),
        bonus: fmt(row.bonus),
        cashback: fmt(row.cashback),
        referral: fmt(row.referral),
        rolling: fmt(row.rolling),
        marketing: fmt(row.marketing),
        total: fmt(winLoss)
      };
    }).sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

    return NextResponse.json({ success: true, data: finalData });

  } catch (err) {
    return NextResponse.json({ success: false, message: err.message, data: [] }, { status: 200 });
  }
}