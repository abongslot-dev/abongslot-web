export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ success: false, message: "Variabel Supabase tidak terbaca!" }, { status: 200 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    // Query data dari tabel-tabel terkait
    const [depoRes, wdRes, adjRes, promoRes, rollRes, refRes] = await Promise.all([
      supabase.from('deposits').select('nominal, created_at, status').gte('created_at', `${from}T00:00:00Z`).lte('created_at', `${to}T23:59:59Z`),
      supabase.from('withdrawals').select('nominal, created_at, status').gte('created_at', `${from}T00:00:00Z`).lte('created_at', `${to}T23:59:59Z`),
      supabase.from('adjustments').select('nominal, type, created_at').gte('created_at', `${from}T00:00:00Z`).lte('created_at', `${to}T23:59:59Z`),
      supabase.from('promo_logs').select('bonus_amount, created_at').gte('created_at', `${from}T00:00:00Z`).lte('created_at', `${to}T23:59:59Z`),
      supabase.from('rollingan_logs').select('amount, created_at').gte('created_at', `${from}T00:00:00Z`).lte('created_at', `${to}T23:59:59Z`),
      supabase.from('referral_logs').select('bonus_amount, created_at').gte('created_at', `${from}T00:00:00Z`).lte('created_at', `${to}T23:59:59Z`)
    ]);

    const reportMap = {};

    const getEntry = (date) => {
      const d = new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
      if (!reportMap[d]) {
        reportMap[d] = { tanggal: d, depo: 0, wd: 0, adjPlus: 0, adjMin: 0, bonus: 0, cashback: 0, referral: 0, rolling: 0, marketing: 0 };
      }
      return reportMap[d];
    };

    // Mapping hasil query ke dalam reportMap
    (depoRes.data || []).forEach(i => { if(i.status?.toLowerCase() === 'approve') getEntry(i.created_at).depo += Number(i.nominal || 0) });
    (wdRes.data || []).forEach(i => { if(i.status?.toLowerCase() === 'success') getEntry(i.created_at).wd += Number(i.nominal || 0) });
    (adjRes.data || []).forEach(i => { 
        const entry = getEntry(i.created_at);
        if(i.type === 'add') entry.adjPlus += Number(i.nominal || 0); else entry.adjMin += Number(i.nominal || 0);
    });
    (promoRes.data || []).forEach(i => getEntry(i.created_at).bonus += Number(i.bonus_amount || 0));
    (rollRes.data || []).forEach(i => getEntry(i.created_at).rolling += Number(i.amount || 0));
    (refRes.data || []).forEach(i => getEntry(i.created_at).referral += Number(i.bonus_amount || 0));

    // Final formatting (menghitung total win/loss)
    const finalData = Object.values(reportMap).map(row => {
      const total = (row.depo + row.adjPlus) - (row.wd + row.adjMin + row.bonus + row.cashback + row.referral + row.rolling);
      return { ...row, total };
    }).sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

    return NextResponse.json({ success: true, data: finalData });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 200 });
  }
}