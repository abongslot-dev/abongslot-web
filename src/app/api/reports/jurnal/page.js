export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from') || '2026-03-01';
    const to = searchParams.get('to') || '2026-03-14';

    // 1. Ambil data DEPOSIT & WD saja (Tabel yang sudah pasti ada datanya)
    const [depoRes, wdRes] = await Promise.all([
      supabase.from('deposits')
        .select('nominal, created_at')
        .or('status.eq.approve,status.eq.success')
        .gte('created_at', `${from}T00:00:00.000Z`)
        .lte('created_at', `${to}T23:59:59.999Z`),
      supabase.from('withdrawals')
        .select('nominal, created_at')
        .or('status.eq.SUCCESS,status.eq.success')
        .gte('created_at', `${from}T00:00:00.000Z`)
        .lte('created_at', `${to}T23:59:59.999Z`)
    ]);

    const reportMap = {};

    // Fungsi bantu grouping biar tidak duplikat
    const getRow = (dateStr) => {
      const d = new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
      if (!reportMap[d]) {
        reportMap[d] = {
          tanggal: d, depo: 0, wd: 0, adjPlus: 0, adjMin: 0,
          bonus: 0, cashback: 0, referral: 0, rolling: 0, marketing: 0, total: 0
        };
      }
      return reportMap[d];
    };

    // Masukkan data Depo (Jika ada)
    if (depoRes.data) {
      depoRes.data.forEach(i => {
        getRow(i.created_at).depo += parseFloat(i.nominal || 0);
      });
    }

    // Masukkan data WD (Jika ada)
    if (wdRes.data) {
      wdRes.data.forEach(i => {
        getRow(i.created_at).wd += parseFloat(i.nominal || 0);
      });
    }

    // 2. Format hasil akhir agar sesuai UI gambar Bos
    const finalData = Object.values(reportMap).map(row => {
      const winLoss = row.depo - row.wd;
      const fmt = (num) => new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(num);

      return {
        ...row,
        depo: fmt(row.depo),
        wd: fmt(row.wd),
        total: fmt(winLoss),
        // Sisa kolom dibikin 0,00 dulu agar tidak kosong
        adjPlus: "0,00", adjMin: "0,00", bonus: "0,00", 
        cashback: "0,00", referral: "0,00", rolling: "0,00", marketing: "0,00"
      };
    }).sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

    // Jika kosong, kirim array kosong bukan error
    return NextResponse.json({ success: true, data: finalData });

  } catch (error) {
    // JANGAN KIRIM 500, KIRIM 200 TAPI DATA KOSONG BIAR GAK CRASH
    return NextResponse.json({ success: false, message: error.message, data: [] }, { status: 200 });
  }
}