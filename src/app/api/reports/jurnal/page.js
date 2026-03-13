export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from'); // Contoh: 2026-03-01
    const to = searchParams.get('to');     // Contoh: 2026-03-14

    // Helper untuk filter tanggal agar presisi (00:00:00 s/d 23:59:59)
    const applyFilter = (query) => {
      if (from && to) {
        return query.gte('created_at', `${from}T00:00:00.000Z`).lte('created_at', `${to}T23:59:59.999Z`);
      }
      return query;
    };

    // 1. Tarik Data dari tabel-tabel utama
    const [depo, wd, adj] = await Promise.all([
      applyFilter(supabase.from('deposits').select('nominal, created_at').or('status.eq.approve,status.eq.success')),
      applyFilter(supabase.from('withdrawals').select('nominal, created_at').or('status.eq.SUCCESS,status.eq.success')),
      applyFilter(supabase.from('adjustments').select('nominal, type, created_at'))
    ]);

    const reportMap = {};

    // Helper untuk inisialisasi baris harian
    const getRow = (dateStr) => {
      // Ubah format created_at ke DD March 2026 agar sesuai UI Bos
      const d = new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
      if (!reportMap[d]) {
        reportMap[d] = {
          tanggal: d, depo: 0, wd: 0, adjPlus: 0, adjMin: 0,
          bonus: 0, cashback: 0, referral: 0, rolling: 0, marketing: 0, total: 0
        };
      }
      return reportMap[d];
    };

    // 2. Masukkan data Deposit (Ghanna 50rb akan masuk di 01 March)
    depo.data?.forEach(i => {
      getRow(i.created_at).depo += parseFloat(i.nominal || 0);
    });

    // 3. Masukkan data Withdraw (Cuan150 50rb akan masuk di 05 March)
    wd.data?.forEach(i => {
      getRow(i.created_at).wd += parseFloat(i.nominal || 0);
    });

    // 4. Masukkan data Adjustment (Jika ada data baru di tabel adjustments)
    adj.data?.forEach(i => {
      const row = getRow(i.created_at);
      if (i.type === 'add') row.adjPlus += parseFloat(i.nominal || 0);
      else row.adjMin += parseFloat(i.nominal || 0);
    });

    // 5. Kalkulasi Final Win/Loss
    const finalData = Object.values(reportMap).map(row => {
      // Rumus: (Depo + Adj+) - (WD + Adj- + Bonus + Cashback + Reff + Rolling)
      const plus = row.depo + row.adjPlus;
      const minus = row.wd + row.adjMin + row.bonus + row.cashback + row.referral + row.rolling;
      const calculatedTotal = plus - minus;
      
      const fmt = (v) => v.toLocaleString('id-ID', { minimumFractionDigits: 2 });
      
      return {
        ...row,
        depo: fmt(row.depo),
        wd: fmt(row.wd),
        adjPlus: fmt(row.adjPlus),
        adjMin: fmt(row.adjMin),
        bonus: fmt(row.bonus),
        total: fmt(calculatedTotal),
        // Nilai mentah untuk pengecekan warna di UI jika perlu
        rawTotal: calculatedTotal 
      };
    }).sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

    return NextResponse.json({ success: true, data: finalData });

  } catch (error) {
    console.error("API Jurnal Error:", error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}