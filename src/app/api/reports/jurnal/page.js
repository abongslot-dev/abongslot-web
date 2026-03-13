export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Pastikan pemanggilan Client tidak crash
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from') || '2026-03-01';
    const to = searchParams.get('to') || '2026-03-14';

    // 1. Ambil data dengan proteksi (jika tabel ga ada, jangan crash)
    const [depoRes, wdRes] = await Promise.all([
      supabase.from('deposits').select('nominal, created_at, status')
        .gte('created_at', `${from}T00:00:00.000Z`)
        .lte('created_at', `${to}T23:59:59.999Z`),
      supabase.from('withdrawals').select('nominal, created_at, status')
        .gte('created_at', `${from}T00:00:00.000Z`)
        .lte('created_at', `${to}T23:59:59.999Z`)
    ]);

    const reportMap = {};

    // Helper Fungsi
    const getRow = (dateStr) => {
      try {
        const d = new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
        if (!reportMap[d]) {
          reportMap[d] = {
            tanggal: d, depo: 0, wd: 0, adjPlus: 0, adjMin: 0,
            bonus: 0, cashback: 0, referral: 0, rolling: 0, marketing: 0, total: 0
          };
        }
        return reportMap[d];
      } catch (e) { return null; }
    };

    // Proses Deposit - Pastikan status matching dengan SQL Bos (approve)
    if (depoRes.data) {
      depoRes.data.forEach(i => {
        const s = (i.status || '').toLowerCase();
        if (s === 'approve' || s === 'success') {
          const row = getRow(i.created_at);
          if (row) row.depo += Number(i.nominal || 0);
        }
      });
    }

    // Proses WD - Pastikan status matching dengan SQL Bos (SUCCESS)
    if (wdRes.data) {
      wdRes.data.forEach(i => {
        const s = (i.status || '').toLowerCase();
        if (s === 'success') {
          const row = getRow(i.created_at);
          if (row) row.wd += Number(i.nominal || 0);
        }
      });
    }

    // 2. Formatting Hasil Akhir
    const finalData = Object.values(reportMap).map(row => {
      const winLoss = row.depo - row.wd;
      // Gunakan formatting yang aman
      const fmt = (n) => n.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

      return {
        tanggal: row.tanggal,
        depo: fmt(row.depo),
        wd: fmt(row.wd),
        adjPlus: "0,00",
        adjMin: "0,00",
        bonus: "0,00",
        cashback: "0,00",
        referral: "0,00",
        rolling: "0,00",
        marketing: "0,00",
        total: fmt(winLoss)
      };
    }).sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

    return NextResponse.json({ success: true, data: finalData });

  } catch (error) {
    console.error("SERVER ERROR:", error);
    // Kirim response sukses kosong agar Vercel tidak memunculkan "Server Side Exception"
    return NextResponse.json({ success: false, data: [], error: error.message });
  }
}