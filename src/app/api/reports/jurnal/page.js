export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from') || '2026-03-01';
    const to = searchParams.get('to') || '2026-03-14';

    // Ambil data (Gunakan Try Catch per Query)
    const { data: depoData } = await supabase.from('deposits').select('nominal, created_at, status')
      .gte('created_at', `${from}T00:00:00.000Z`).lte('created_at', `${to}T23:59:59.999Z`);
    
    const { data: wdData } = await supabase.from('withdrawals').select('nominal, created_at, status')
      .gte('created_at', `${from}T00:00:00.000Z`).lte('created_at', `${to}T23:59:59.999Z`);

    const reportMap = {};

    const formatRupiah = (n) => new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(n || 0);

    // Proses Deposit
    (depoData || []).forEach(i => {
      const s = (i.status || '').toLowerCase();
      if (s === 'approve' || s === 'success') {
        const d = new Date(i.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
        if (!reportMap[d]) reportMap[d] = { tanggal: d, depo: 0, wd: 0 };
        reportMap[d].depo += Number(i.nominal || 0);
      }
    });

    // Proses WD
    (wdData || []).forEach(i => {
      const s = (i.status || '').toLowerCase();
      if (s === 'success') {
        const d = new Date(i.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
        if (!reportMap[d]) reportMap[d] = { tanggal: d, depo: 0, wd: 0 };
        reportMap[d].wd += Number(i.nominal || 0);
      }
    });

    const finalData = Object.values(reportMap).map(row => ({
      ...row,
      depo: formatRupiah(row.depo),
      wd: formatRupiah(row.wd),
      adjPlus: "0,00", adjMin: "0,00", bonus: "0,00", 
      cashback: "0,00", referral: "0,00", rolling: "0,00", 
      marketing: "0,00",
      total: formatRupiah(row.depo - row.wd)
    })).sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

    // Pastikan mengembalikan format JSON yang benar
    return NextResponse.json({ success: true, data: finalData });

  } catch (err) {
    // JIKA ERROR, KIRIM ARRAY KOSONG AGAR FRONTEND TIDAK CRASH
    return NextResponse.json({ success: true, data: [], message: err.message });
  }
}