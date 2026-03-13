export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export async function GET(request) {
  try {
    // 1. Ambil params tanggal dari URL (untuk filter pencarian)
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from'); // YYYY-MM-DD
    const to = searchParams.get('to');     // YYYY-MM-DD

    // 2. Siapkan Query (Gunakan Range Tanggal jika ada)
    const filterRange = (query) => {
      if (from && to) {
        return query.gte('created_at', `${from}T00:00:00.000Z`).lte('created_at', `${to}T23:59:59.999Z`);
      }
      return query;
    };

    // 3. Ambil data secara paralel
    const [depo, wd, adj, promo, roll, reff] = await Promise.all([
      filterRange(supabase.from('deposits').select('nominal, created_at').or('status.eq.approve,status.eq.success')),
      filterRange(supabase.from('withdrawals').select('nominal, created_at').or('status.eq.SUCCESS,status.eq.success')),
      filterRange(supabase.from('adjustments').select('nominal, type, created_at')),
      filterRange(supabase.from('promo_logs').select('bonus_amount, created_at')),
      filterRange(supabase.from('rollingan_logs').select('amount, created_at')),
      filterRange(supabase.from('referral_logs').select('bonus_amount, created_at'))
    ]);

    // 4. Proses Grouping Berdasarkan Tanggal
    const hasilGrouping = {};

    const getEntry = (date) => {
      const d = new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
      if (!hasilGrouping[d]) {
        hasilGrouping[d] = {
          tanggal: d, depo: 0, wd: 0, adjPlus: 0, adjMin: 0,
          bonus: 0, cashback: 0, referral: 0, rolling: 0, marketing: 0, total: 0
        };
      }
      return hasilGrouping[d];
    };

    // Isi masing-masing kategori
    depo.data?.forEach(i => getEntry(i.created_at).depo += parseFloat(i.nominal || 0));
    wd.data?.forEach(i => getEntry(i.created_at).wd += parseFloat(i.nominal || 0));
    adj.data?.forEach(i => {
      const entry = getEntry(i.created_at);
      if (i.type === 'add') entry.adjPlus += parseFloat(i.nominal || 0);
      else entry.adjMin += parseFloat(i.nominal || 0);
    });
    promo.data?.forEach(i => getEntry(i.created_at).bonus += parseFloat(i.bonus_amount || 0));
    roll.data?.forEach(i => getEntry(i.created_at).rolling += parseFloat(i.amount || 0));
    reff.data?.forEach(i => getEntry(i.created_at).referral += parseFloat(i.bonus_amount || 0));

    // 5. Hitung Final Total per baris
    // Rumus Win/Loss: (Depo + Adj+) - (WD + Adj- + Bonus + Reff + Rolling)
    const finalData = Object.values(hasilGrouping).map(row => {
      const totalPlus = row.depo + row.adjPlus;
      const totalMin = row.wd + row.adjMin + row.bonus + row.cashback + row.referral + row.rolling;
      row.total = totalPlus - totalMin;
      
      // Format angka jadi string ribuan untuk UI
      const format = (v) => v.toLocaleString('id-ID', { minimumFractionDigits: 2 });
      return {
        ...row,
        depo: format(row.depo),
        wd: format(row.wd),
        adjPlus: format(row.adjPlus),
        adjMin: format(row.adjMin),
        bonus: format(row.bonus),
        cashback: format(row.cashback),
        referral: format(row.referral),
        rolling: format(row.rolling),
        marketing: format(row.marketing),
        total: format(row.total)
      };
    });

    return NextResponse.json({ success: true, data: finalData });
  } catch (error) {
    console.error("Jurnal Error:", error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}