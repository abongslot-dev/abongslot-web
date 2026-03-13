export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ success: false, message: "Variabel Env tidak ditemukan!" }, { status: 200 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    if (!from || !to) {
      return NextResponse.json({ success: false, message: "Tanggal tidak valid!" }, { status: 200 });
    }

    // Ambil data dari tabel yang ada di database Bos
    const [depoRes, wdRes, adjRes] = await Promise.all([
      supabase.from('deposits').select('nominal, created_at, status').gte('created_at', from).lte('created_at', to),
      supabase.from('withdrawals').select('nominal, created_at, status').gte('created_at', from).lte('created_at', to),
      supabase.from('adjustments').select('nominal, type, created_at').gte('created_at', from).lte('created_at', to)
    ]);

    // Jika ada error di salah satu query, jangan buat crash 500
    if (depoRes.error || wdRes.error || adjRes.error) {
      return NextResponse.json({ 
        success: false, 
        message: "Error Database", 
        detail: depoRes.error?.message || wdRes.error?.message || adjRes.error?.message 
      }, { status: 200 });
    }

    const reportMap = {};
    const fmt = (n) => new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(n || 0);

    const getEntry = (createdAt) => {
      const dateOnly = createdAt.split('T')[0]; // Ambil YYYY-MM-DD
      const d = new Date(dateOnly).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
      if (!reportMap[d]) {
        reportMap[d] = { tanggal: d, depo: 0, wd: 0, adjPlus: 0, adjMin: 0, bonus: 0, cashback: 0, referral: 0, rolling: 0, marketing: 0 };
      }
      return reportMap[d];
    };

    // Mapping Data
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

    // Formatting hasil untuk Frontend
    const finalData = Object.values(reportMap).map(row => {
      const total = (row.depo + row.adjPlus) - (row.wd + row.adjMin);
      return {
        ...row,
        depo: fmt(row.depo),
        wd: fmt(row.wd),
        adjPlus: fmt(row.adjPlus),
        adjMin: fmt(row.adjMin),
        total: fmt(total),
        bonus: "0,00", cashback: "0,00", referral: "0,00", rolling: "0,00", marketing: "0,00"
      };
    });

    return NextResponse.json({ success: true, data: finalData });

  } catch (err) {
    return NextResponse.json({ success: false, message: "Fatal Error: " + err.message }, { status: 200 });
  }
}