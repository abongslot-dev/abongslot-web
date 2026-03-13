export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request) {
  // Gunakan SERVICE_ROLE_KEY agar bisa tembus RLS dan tidak Error 500
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    // Tarik data hanya dari tabel yang terbukti ada di database Bos
    const [depoRes, wdRes, adjRes] = await Promise.all([
      supabase.from('deposits').select('nominal, created_at, status')
        .gte('created_at', `${from}T00:00:00Z`).lte('created_at', `${to}T23:59:59Z`),
      supabase.from('withdrawals').select('nominal, created_at, status')
        .gte('created_at', `${from}T00:00:00Z`).lte('created_at', `${to}T23:59:59Z`),
      supabase.from('adjustments').select('nominal, type, created_at')
        .gte('created_at', `${from}T00:00:00Z`).lte('created_at', `${to}T23:59:59Z`)
    ]);

    // Cek jika ada error query
    if (depoRes.error || wdRes.error || adjRes.error) {
      return NextResponse.json({ 
        success: false, 
        message: "Database Error: " + (depoRes.error?.message || wdRes.error?.message || adjRes.error?.message) 
      }, { status: 200 });
    }

    const reportMap = {};
    const getEntry = (date) => {
      const d = new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
      if (!reportMap[d]) {
        reportMap[d] = { tanggal: d, depo: 0, wd: 0, adjPlus: 0, adjMin: 0, total: 0 };
      }
      return reportMap[d];
    };

    // Proses Data
    (depoRes.data || []).forEach(i => {
      if (['approve', 'success'].includes(i.status?.toLowerCase())) getEntry(i.created_at).depo += Number(i.nominal || 0);
    });
    (wdRes.data || []).forEach(i => {
      if (i.status?.toLowerCase() === 'success') getEntry(i.created_at).wd += Number(i.nominal || 0);
    });
    (adjRes.data || []).forEach(i => {
      const entry = getEntry(i.created_at);
      if (i.type === 'add') entry.adjPlus += Number(i.nominal || 0);
      else entry.adjMin += Number(i.nominal || 0);
    });

    const finalData = Object.values(reportMap).map(row => {
      const total = (row.depo + row.adjPlus) - (row.wd + row.adjMin);
      const fmt = (n) => new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(n);
      return {
        ...row,
        depo: fmt(row.depo),
        wd: fmt(row.wd),
        adjPlus: fmt(row.adjPlus),
        adjMin: fmt(row.adjMin),
        bonus: "0,00", cashback: "0,00", referral: "0,00", rolling: "0,00", marketing: "0,00",
        total: fmt(total)
      };
    }).sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

    return NextResponse.json({ success: true, data: finalData });

  } catch (error) {
    return NextResponse.json({ success: false, message: "Fatal Error: " + error.message }, { status: 200 });
  }
}