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

    // --- LOGIKA RESET TEPAT JAM 00:00 WIB (Sangat Akurat) ---
    // Pastikan kita ambil tanggal hari ini sesuai zona Jakarta
    const now = new Date();
    const wibDateString = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' }); // Hasil: "YYYY-MM-DD"
    
    // Ini adalah kunci resetnya: 
    // Kita buat batas waktu mulai dari jam 00:00:00 pagi tadi waktu Jakarta
    const startOfTodayWIB = new Date(`${wibDateString}T00:00:00+07:00`).getTime();

    // ... Sisa kodingan query Bos tetap sama ...
    const [depoRes, wdRes, memberRes] = await Promise.all([
      supabase.from('deposits').select('status, nominal, created_at'),
      supabase.from('withdrawals').select('status, nominal, created_at'),
      supabase.from('members').select('id, created_at')
    ]);

    // ... (logic fetch error checking ...)

    const calculateStats = (data) => {
      const res = {
        countPending: 0, totalPending: 0,
        countSuccess: 0, totalSuccess: 0,
        countReject: 0, totalReject: 0,
        todayCount: 0, todayAmount: 0
      };

      data.forEach(item => {
        const status = (item.status || 'pending').toLowerCase();
        const nominal = parseFloat(item.nominal || 0);
        
        // GUNAKAN .getTime() agar perbandingan angka (milidetik) lebih pasti
        const createdAt = new Date(item.created_at).getTime();

        if (status === 'pending') {
          res.countPending++;
          res.totalPending += nominal;
        } 
        else if (status === 'success' || status === 'approve') {
          res.countSuccess++;
          res.totalSuccess += nominal;
          
          // Bandingkan angka milidetik (createdAt vs startOfTodayWIB)
          if (createdAt >= startOfTodayWIB) {
            res.todayCount++;
            res.todayAmount += nominal;
          }
        }
        else if (['reject', 'rejected'].includes(status)) {
          res.countReject++;
          res.totalReject += nominal;
        }
      });
      return res;
    };

    const depoStats = calculateStats(depoRes.data);
    const wdStats = calculateStats(wdRes.data);
    
    const totalMembers = memberRes.data.length;
    // Filter member baru hari ini menggunakan WIB
    const newMembersToday = memberRes.data.filter(m => new Date(m.created_at) >= startOfTodayWIB).length;

    return NextResponse.json({
      success: true,
      data: {
        deposit: depoStats,
        withdrawal: wdStats,
        members: {
          total: totalMembers,
          newToday: newMembersToday
        },
        today: {
          deposit: depoStats.todayAmount,
          withdrawal: wdStats.todayAmount,
          depositCount: depoStats.todayCount,
          withdrawalCount: wdStats.todayCount
        }
      }
    });

  } catch (error) {
    console.error("Dashboard API Error:", error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}