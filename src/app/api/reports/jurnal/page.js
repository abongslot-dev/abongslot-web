export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request) {
  // 1. Inisialisasi Supabase di dalam fungsi agar lebih aman
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ success: false, message: "Missing API Keys", data: [] });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    // Pastikan filter tanggal ada, jika tidak pakai hari ini
    const startDate = from ? `${from}T00:00:00.000Z` : new Date().toISOString();
    const endDate = to ? `${to}T23:59:59.999Z` : new Date().toISOString();

    // 2. Ambil data dengan pembungkus try-catch per query
    const [depoRes, wdRes] = await Promise.all([
      supabase.from('deposits').select('nominal, created_at, status')
        .gte('created_at', startDate).lte('created_at', endDate),
      supabase.from('withdrawals').select('nominal, created_at, status')
        .gte('created_at', startDate).lte('created_at', endDate)
    ]);

    // Jika Supabase error (tabel ga ada), jangan crash, kasih array kosong saja
    const depoData = depoRes.data || [];
    const wdData = wdRes.data || [];

    const reportMap = {};

    // 3. Proses Grouping
    const processData = (data, type) => {
      data.forEach(i => {
        const s = (i.status || '').toLowerCase();
        // Filter: Hanya yang approve/success
        if (s === 'approve' || s === 'success') {
          const dateObj = new Date(i.created_at);
          if (isNaN(dateObj)) return; // Skip jika tanggal rusak
          
          const d = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
          
          if (!reportMap[d]) {
            reportMap[d] = { tanggal: d, depo: 0, wd: 0, total: 0 };
          }
          
          if (type === 'depo') reportMap[d].depo += Number(i.nominal || 0);
          if (type === 'wd') reportMap[d].wd += Number(i.nominal || 0);
        }
      });
    };

    processData(depoData, 'depo');
    processData(wdData, 'wd');

    // 4. Final Formatting sesuai Gambar Bos
    const finalData = Object.values(reportMap).map(row => {
      const calcTotal = row.depo - row.wd;
      const fmt = (n) => new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(n);

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
        total: fmt(calcTotal)
      };
    }).sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

    return NextResponse.json({ success: true, data: finalData });

  } catch (err) {
    console.error("Jurnal Error:", err);
    // KUNCI: Selalu kirim status 200 agar frontend tidak nerima HTML
    return NextResponse.json({ success: false, message: err.message, data: [] }, { status: 200 });
  }
}