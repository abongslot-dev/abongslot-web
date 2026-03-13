export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    // TARIK DATA HANYA DARI TABEL YANG ADA DI GAMBAR DATABASE BOS
    const [depoRes, wdRes, adjRes] = await Promise.all([
      supabase.from('deposits').select('nominal, created_at, status')
        .gte('created_at', `${from}T00:00:00Z`).lte('created_at', `${to}T23:59:59Z`),
      supabase.from('withdrawals').select('nominal, created_at, status')
        .gte('created_at', `${from}T00:00:00Z`).lte('created_at', `${to}T23:59:59Z`),
      supabase.from('adjustments').select('nominal, type, created_at')
        .gte('created_at', `${from}T00:00:00Z`).lte('created_at', `${to}T23:59:59Z`)
    ]);

    const reportMap = {};

    const getEntry = (date) => {
      const d = new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
      if (!reportMap[d]) {
        reportMap[d] = { tanggal: d, depo: 0, wd: 0, adjPlus: 0, adjMin: 0, bonus: 0, cashback: 0, referral: 0, rolling: 0, marketing: 0 };
      }
      return reportMap[d];
    };

    // 1. Proses Deposit (Hanya yang Approve/Success)
    (depoRes.data || []).forEach(i => {
      const s = i.status?.toLowerCase();
      if (s === 'approve' || s === 'success') getEntry(i.created_at).depo += Number(i.nominal || 0);
    });

    // 2. Proses Withdrawal
    (wdRes.data || []).forEach(i => {
      const s = i.status?.toLowerCase();
      if (s === 'success') getEntry(i.created_at).wd += Number(i.nominal || 0);
    });

    // 3. Proses Adjustment
    (adjRes.data || []).forEach(i => {
      const entry = getEntry(i.created_at);
      if (i.type === 'add') entry.adjPlus += Number(i.nominal || 0);
      else entry.adjMin += Number(i.nominal || 0);
    });

    // 4. Formatting Akhir
    const finalData = Object.values(reportMap).map(row => {
      // Rumus: (Depo + Adj+) - (WD + Adj-)
      const totalWinLoss = (row.depo + row.adjPlus) - (row.wd + row.adjMin);
      
      const fmt = (n) => new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(n);

      return {
        tanggal: row.tanggal,
        depo: fmt(row.depo),
        wd: fmt(row.wd),
        adjPlus: fmt(row.adjPlus),
        adjMin: fmt(row.adjMin),
        bonus: "0,00", // Kosongkan dulu karena tabel log belum ada
        cashback: "0,00",
        referral: "0,00",
        rolling: "0,00",
        marketing: "0,00",
        total: fmt(totalWinLoss)
      };
    }).sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

    return NextResponse.json({ success: true, data: finalData });

  } catch (error) {
    // Balas dengan JSON agar tidak kena "Unexpected Token <"
    return NextResponse.json({ success: false, message: error.message, data: [] }, { status: 200 });
  }
}