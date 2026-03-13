export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function GET() {
  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase Configuration");
    }

    // --- LOGIKA WAKTU WIB ---
    // Mengambil tanggal hari ini format YYYY-MM-DD sesuai zona Jakarta
    const todayWIB = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Jakarta',
    }).format(new Date());

    const startOfToday = `${todayWIB}T00:00:00+07:00`;

    // 1. AMBIL SEMUA DATA (Untuk Ringkasan Total)
    const [depoRes, wdRes, memberRes] = await Promise.all([
      supabase.from('deposits').select('status, nominal, created_at'),
      supabase.from('withdrawals').select('status, nominal, created_at'),
      supabase.from('members').select('id, created_at')
    ]);

    // 2. AMBIL DATA KHUSUS HARI INI (Supaya Akurat & Pasti Reset)
    const [todayDepoRes, todayWdRes, todayMemberRes] = await Promise.all([
      supabase.from('deposits').select('nominal').eq('status', 'success').gte('created_at', startOfToday),
      supabase.from('withdrawals').select('nominal').eq('status', 'success').gte('created_at', startOfToday),
      supabase.from('members').select('id').gte('created_at', startOfToday)
    ]);

    const calculateStats = (data) => {
      const res = {
        countPending: 0, totalPending: 0,
        countSuccess: 0, totalSuccess: 0,
        countReject: 0, totalReject: 0
      };

      data.forEach(item => {
        const status = (item.status || 'pending').toLowerCase();
        const nominal = parseFloat(item.nominal || 0);

        if (status === 'pending') {
          res.countPending++;
          res.totalPending += nominal;
        } else if (status === 'success' || status === 'approve') {
          res.countSuccess++;
          res.totalSuccess += nominal;
        } else if (['reject', 'rejected'].includes(status)) {
          res.countReject++;
          res.totalReject += nominal;
        }
      });
      return res;
    };

    const depoStats = calculateStats(depoRes.data || []);
    const wdStats = calculateStats(wdRes.data || []);

    // Hitung angka khusus hari ini
    const todayDepoCount = todayDepoRes.data?.length || 0;
    const todayDepoAmount = todayDepoRes.data?.reduce((sum, i) => sum + parseFloat(i.nominal || 0), 0) || 0;
    const todayWdCount = todayWdRes.data?.length || 0;
    const todayWdAmount = todayWdRes.data?.reduce((sum, i) => sum + parseFloat(i.nominal || 0), 0) || 0;

    return NextResponse.json({
      success: true,
      data: {
        deposit: depoStats,
        withdrawal: wdStats,
        members: {
          total: memberRes.data?.length || 0,
          newToday: todayMemberRes.data?.length || 0
        },
        today: {
          deposit: todayDepoAmount,
          withdrawal: todayWdAmount,
          depositCount: todayDepoCount,
          withdrawalCount: todayWdCount
        }
      }
    });

  } catch (error) {
    console.error("Dashboard API Error:", error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}