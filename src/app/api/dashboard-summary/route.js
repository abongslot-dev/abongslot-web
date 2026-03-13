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

    // Buat range waktu untuk "Hari Ini" (00:00 sampai 23:59)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    // 1. Ambil SEMUA data yang dibutuhkan secara paralel
    const [depoRes, wdRes, memberRes] = await Promise.all([
      supabase.from('deposits').select('status, nominal, created_at'),
      supabase.from('withdrawals').select('status, nominal, created_at'),
      supabase.from('users').select('id, created_at') // Asumsi tabel member namanya 'users'
    ]);

    if (depoRes.error) throw depoRes.error;
    if (wdRes.error) throw wdRes.error;
    if (memberRes.error) throw memberRes.error;

    // 2. Fungsi hitung ringkasan (Total & Hari Ini)
    const calculateStats = (data) => {
      const result = {
        countPending: 0, totalPending: 0,
        countSuccess: 0, totalSuccess: 0,
        countReject: 0, totalReject: 0,
        todayCount: 0, todayAmount: 0
      };

      data.forEach(curr => {
        const status = (curr.status || 'pending').toLowerCase();
        const nominal = parseFloat(curr.nominal || 0);
        const createdAt = new Date(curr.created_at);

        // Hitung Berdasarkan Status
        if (status === 'pending') {
          result.countPending++;
          result.totalPending += nominal;
        } else if (status === 'success' || status === 'approve') {
          result.countSuccess++;
          result.totalSuccess += nominal;
          
          // Khusus yang Sukses HARI INI
          if (createdAt >= today) {
            result.todayCount++;
            result.todayAmount += nominal;
          }
        } else if (status === 'reject' || status === 'rejected') {
          result.countReject++;
          result.totalReject += nominal;
        }
      });
      return result;
    };

    const depoStats = calculateStats(depoRes.data);
    const wdStats = calculateStats(wdRes.data);

    // 3. Hitung Member (Total vs Baru Hari Ini)
    const totalMembers = memberRes.data.length;
    const newMembersToday = memberRes.data.filter(m => new Date(m.created_at) >= today).length;

    // 4. Susun Response agar cocok dengan State di Dashboard
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