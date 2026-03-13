export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    // 1. Ambil data secara terpisah agar jika satu tabel error, yang lain tetap jalan
    const fetchTable = async (table, selectStr, filterStatus = null) => {
      let query = supabase.from(table).select(selectStr);
      
      if (from && to) {
        query = query.gte('created_at', `${from}T00:00:00.000Z`).lte('created_at', `${to}T23:59:59.999Z`);
      }
      
      if (filterStatus) {
        query = query.or(filterStatus);
      }

      const { data, error } = await query;
      if (error) {
        console.error(`Error di tabel ${table}:`, error.message);
        return [];
      }
      return data || [];
    };

    // Eksekusi semua query
    const [deposits, withdrawals, adjustments] = await Promise.all([
      fetchTable('deposits', 'nominal, created_at, status', 'status.eq.approve,status.eq.success'),
      fetchTable('withdrawals', 'nominal, created_at, status', 'status.eq.SUCCESS,status.eq.success'),
      fetchTable('adjustments', 'nominal, type, created_at')
    ]);

    const reportMap = {};

    // Helper untuk grouping
    const addToMap = (date, key, val) => {
      if (!date) return;
      const d = new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
      if (!reportMap[d]) {
        reportMap[d] = {
          tanggal: d, depo: 0, wd: 0, adjPlus: 0, adjMin: 0,
          bonus: 0, cashback: 0, referral: 0, rolling: 0, marketing: 0, total: 0
        };
      }
      reportMap[d][key] += parseFloat(val || 0);
    };

    // Proses data masuk ke Map
    deposits.forEach(i => addToMap(i.created_at, 'depo', i.nominal));
    withdrawals.forEach(i => addToMap(i.created_at, 'wd', i.nominal));
    adjustments.forEach(i => {
      const field = i.type === 'add' ? 'adjPlus' : 'adjMin';
      addToMap(i.created_at, field, i.nominal);
    });

    // Finalisasi data untuk dikirim ke UI
    const finalData = Object.values(reportMap).map(row => {
      const calcTotal = (row.depo + row.adjPlus) - (row.wd + row.adjMin + row.bonus + row.cashback + row.referral + row.rolling);
      
      const fmt = (v) => new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(v);

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
        total: fmt(calcTotal)
      };
    }).sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

    return NextResponse.json({ success: true, data: finalData });

  } catch (err) {
    console.error("CRITICAL ERROR:", err.message);
    return NextResponse.json({ success: false, message: err.message, data: [] }, { status: 200 }); // Kirim 200 agar UI tidak crash
  }
}