export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    // Fungsi pembantu agar tidak crash jika tabel kosong/error
    const safeQuery = async (tableName, selectStr) => {
      try {
        let q = supabase.from(tableName).select(selectStr);
        if (from && to) {
          q = q.gte('created_at', `${from}T00:00:00.000Z`).lte('created_at', `${to}T23:59:59.999Z`);
        }
        const { data, error } = await q;
        if (error) {
          console.warn(`Tabel ${tableName} bermasalah atau belum dibuat:`, error.message);
          return []; // Kembalikan array kosong jika tabel error/tidak ada
        }
        return data || [];
      } catch (e) {
        return [];
      }
    };

    // Ambil data satu per satu secara aman
    const depoData = await safeQuery('deposits', 'nominal, created_at, status');
    const wdData = await safeQuery('withdrawals', 'nominal, created_at, status');
    
    // Tabel-tabel tambahan ini sering jadi penyebab 500 jika belum dibuat di Supabase
    const adjData = await safeQuery('adjustments', 'nominal, type, created_at');
    const promoData = await safeQuery('promo_logs', 'bonus_amount, created_at');
    const rollData = await safeQuery('rollingan_logs', 'amount, created_at');
    const reffData = await safeQuery('referral_logs', 'bonus_amount, created_at');

    const hasilGrouping = {};

    const getEntry = (date) => {
      if (!date) return null;
      // Format tanggal untuk baris tabel
      const d = new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
      if (!hasilGrouping[d]) {
        hasilGrouping[d] = {
          tanggal: d, depo: 0, wd: 0, adjPlus: 0, adjMin: 0,
          bonus: 0, cashback: 0, referral: 0, rolling: 0, marketing: 0, total: 0
        };
      }
      return hasilGrouping[d];
    };

    // Proses data (hanya ambil yang sukses/approve)
    depoData.filter(i => ['approve', 'success'].includes(i.status?.toLowerCase())).forEach(i => {
      const entry = getEntry(i.created_at);
      if (entry) entry.depo += parseFloat(i.nominal || 0);
    });

    wdData.filter(i => ['success'].includes(i.status?.toLowerCase())).forEach(i => {
      const entry = getEntry(i.created_at);
      if (entry) entry.wd += parseFloat(i.nominal || 0);
    });

    adjData.forEach(i => {
      const entry = getEntry(i.created_at);
      if (entry) {
        if (i.type === 'add') entry.adjPlus += parseFloat(i.nominal || 0);
        else entry.adjMin += parseFloat(i.nominal || 0);
      }
    });

    promoData.forEach(i => {
      const entry = getEntry(i.created_at);
      if (entry) entry.bonus += parseFloat(i.bonus_amount || 0);
    });

    // Kalkulasi Akhir
    const finalData = Object.values(hasilGrouping).map(row => {
      const totalPlus = row.depo + row.adjPlus;
      const totalMin = row.wd + row.adjMin + row.bonus + row.cashback + row.referral + row.rolling;
      row.total = totalPlus - totalMin;
      
      // Format ke ribuan untuk UI
      const fmt = (v) => v.toLocaleString('id-ID', { minimumFractionDigits: 2 });
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
        total: fmt(row.total)
      };
    }).sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

    return NextResponse.json({ success: true, data: finalData });

  } catch (error) {
    console.error("Critical Error Jurnal:", error.message);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan internal" }, { status: 500 });
  }
}