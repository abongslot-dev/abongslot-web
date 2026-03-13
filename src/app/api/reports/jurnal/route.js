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

    if (!from || !to) {
      return NextResponse.json({ success: false, message: "Pilih rentang tanggal!" });
    }

    // TARIK DATA DENGAN FILTER (Agar Ringan & Akurat)
    const [depoRes, wdRes, adjRes] = await Promise.all([
      supabase.from('deposits').select('nominal, created_at, status')
        .gte('created_at', `${from}T00:00:00Z`).lte('created_at', `${to}T23:59:59Z`),
      supabase.from('withdrawals').select('nominal, created_at, status')
        .gte('created_at', `${from}T00:00:00Z`).lte('created_at', `${to}T23:59:59Z`),
      supabase.from('adjustments').select('nominal, type, created_at')
        .gte('created_at', `${from}T00:00:00Z`).lte('created_at', `${to}T23:59:59Z`)
    ]);

    const reportMap = {};
    const fmt = (n) => new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(n || 0);

    // FUNGSI OTOMATIS TAMBAH BARIS PER HARI
    const getRow = (dateStr) => {
      // Kita ambil tanggalnya saja tanpa jam
      const dateObj = new Date(dateStr);
      const d = dateObj.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
      
      if (!reportMap[d]) {
        reportMap[d] = { 
          tanggal: d, 
          depo: 0, 
          wd: 0, 
          adjPlus: 0, 
          adjMin: 0,
          rawDate: dateObj.getTime() // Untuk sorting
        };
      }
      return reportMap[d];
    };

    // Mapping Data
    (depoRes.data || []).forEach(i => {
      if (['approve', 'success'].includes(i.status?.toLowerCase())) getRow(i.created_at).depo += Number(i.nominal || 0);
    });
    (wdRes.data || []).forEach(i => {
      if (i.status?.toLowerCase() === 'success') getRow(i.created_at).wd += Number(i.nominal || 0);
    });
    (adjRes.data || []).forEach(i => {
      const r = getRow(i.created_at);
      if (i.type === 'add') r.adjPlus += Number(i.nominal || 0);
      else r.adjMin += Number(i.nominal || 0);
    });

    const finalResult = Object.values(reportMap).map(row => ({
      ...row,
      depo: fmt(row.depo),
      wd: fmt(row.wd),
      adjPlus: fmt(row.adjPlus),
      adjMin: fmt(row.adjMin),
      bonus: "0,00", cashback: "0,00", referral: "0,00", rolling: "0,00", marketing: "0,00",
      total: fmt((row.depo + row.adjPlus) - (row.wd + row.adjMin))
    })).sort((a, b) => b.rawDate - a.rawDate); // TERBARU DI ATAS

    return NextResponse.json({ success: true, data: finalResult });

  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 200 });
  }
}