export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request) {
  // Ambil URL dan Key dari Vercel Settings
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Prioritaskan SERVICE_ROLE_KEY agar bisa tembus RLS
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ success: false, message: "Variabel Env tidak terbaca!" }, { status: 200 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    if (!from || !to) {
      return NextResponse.json({ success: false, message: "Parameter tanggal (from/to) wajib diisi!" });
    }

    // Ambil data hanya dari tabel yang terbukti ada di database Bos (Gambar 2)
const [depoRes, wdRes, adjRes] = await Promise.all([
  supabase.from('deposits').select('nominal, created_at, status'),
  supabase.from('withdrawals').select('nominal, created_at, status'),
  supabase.from('adjustments').select('nominal, type, created_at')
]);

    // Jika salah satu tabel bermasalah, kirim pesan error yang jelas (Bukan 500)
    if (depoRes.error || wdRes.error || adjRes.error) {
      return NextResponse.json({ 
        success: false, 
        message: "Database Error", 
        detail: depoRes.error?.message || wdRes.error?.message || adjRes.error?.message 
      });
    }

    const reportMap = {};
    const fmt = (n) => new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(n || 0);

    // Helper untuk membuat baris tanggal
    const getRow = (dateStr) => {
      const d = new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
      if (!reportMap[d]) {
        reportMap[d] = { tanggal: d, depo: 0, wd: 0, adjPlus: 0, adjMin: 0, total: 0 };
      }
      return reportMap[d];
    };

    // Proses data satu per satu dengan aman
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
    })).sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

    return NextResponse.json({ success: true, data: finalResult });

  } catch (err) {
    // Tangkap error fatal agar tidak jadi Error 500
    return NextResponse.json({ success: false, message: "Fatal Server Error: " + err.message }, { status: 200 });
  }
}