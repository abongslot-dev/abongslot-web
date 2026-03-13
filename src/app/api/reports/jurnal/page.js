export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from') || new Date().toISOString().split('T')[0];
    const to = searchParams.get('to') || new Date().toISOString().split('T')[0];

    // Ambil semua data yang dibutuhkan sesuai kolom di gambar
    const [depoRes, wdRes, promoRes, rollRes, refRes, adjRes] = await Promise.all([
      supabase.from('deposits').select('nominal, created_at').or('status.eq.approve,status.eq.success').gte('created_at', `${from}T00:00:00Z`).lte('created_at', `${to}T23:59:59Z`),
      supabase.from('withdrawals').select('nominal, created_at').or('status.eq.SUCCESS,status.eq.success').gte('created_at', `${from}T00:00:00Z`).lte('created_at', `${to}T23:59:59Z`),
      supabase.from('promo_logs').select('bonus_amount, created_at').gte('created_at', `${from}T00:00:00Z`).lte('created_at', `${to}T23:59:59Z`),
      supabase.from('rollingan_logs').select('amount, created_at').gte('created_at', `${from}T00:00:00Z`).lte('created_at', `${to}T23:59:59Z`),
      supabase.from('referral_logs').select('bonus_amount, created_at').gte('created_at', `${from}T00:00:00Z`).lte('created_at', `${to}T23:59:59Z`),
      supabase.from('adjustments').select('nominal, type, created_at').gte('created_at', `${from}T00:00:00Z`).lte('created_at', `${to}T23:59:59Z`)
    ]);

    const reportMap = {};

    const getRow = (dateStr) => {
      const d = new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
      if (!reportMap[d]) {
        reportMap[d] = { tanggal: d, depo: 0, wd: 0, adjPlus: 0, adjMin: 0, bonus: 0, cashback: 0, referral: 0, rolling: 0, marketing: 0 };
      }
      return reportMap[d];
    };

    // Isi data ke Map
    (depoRes.data || []).forEach(i => getRow(i.created_at).depo += Number(i.nominal || 0));
    (wdRes.data || []).forEach(i => getRow(i.created_at).wd += Number(i.nominal || 0));
    (promoRes.data || []).forEach(i => getRow(i.created_at).bonus += Number(i.bonus_amount || 0));
    (rollRes.data || []).forEach(i => getRow(i.created_at).rolling += Number(i.amount || 0));
    (refRes.data || []).forEach(i => getRow(i.created_at).referral += Number(i.bonus_amount || 0));
    (adjRes.data || []).forEach(i => {
      const row = getRow(i.created_at);
      if (i.type === 'add') row.adjPlus += Number(i.nominal || 0);
      else row.adjMin += Number(i.nominal || 0);
    });

    const finalData = Object.values(reportMap).map(row => {
      // Rumus Win/Loss sesuai standar jurnal
      const total = (row.depo + row.adjPlus) - (row.wd + row.adjMin + row.bonus + row.cashback + row.referral + row.rolling);
      
      const fmt = (n) => new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(n);
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
        total: fmt(total)
      };
    }).sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

    return NextResponse.json({ success: true, data: finalData });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message, data: [] }, { status: 200 });
  }
}