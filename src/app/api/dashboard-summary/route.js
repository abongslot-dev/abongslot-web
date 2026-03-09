export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// AMBIL DARI ENV (Jangan di-hardcode kuncinya di sini!)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function GET() {
  try {
    // Tambahkan pengecekan koneksi
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase Configuration");
    }

    // Ambil data dengan timeout/safety
    const [depoRes, wdRes] = await Promise.all([
      supabase.from('deposits').select('status, nominal'),
      supabase.from('withdrawals').select('status, nominal')
    ]);

    if (depoRes.error) throw depoRes.error;
    if (wdRes.error) throw wdRes.error;

    const calculateSummary = (data) => {
      if (!data) return { countPending: 0, totalPending: 0, countSuccess: 0, totalSuccess: 0, countReject: 0, totalReject: 0 };
      
      return data.reduce((acc, curr) => {
        const status = (curr.status || 'pending').toLowerCase();
        const nominal = parseFloat(curr.nominal || 0);

        // Gabungkan status 'approve' dan 'success'
        if (status === 'pending') {
          acc.countPending++;
          acc.totalPending += nominal;
        } else if (status === 'success' || status === 'approve') {
          acc.countSuccess++;
          acc.totalSuccess += nominal;
        } else if (status === 'reject' || status === 'rejected') {
          acc.countReject++;
          acc.totalReject += nominal;
        }
        return acc;
      }, { countPending: 0, totalPending: 0, countSuccess: 0, totalSuccess: 0, countReject: 0, totalReject: 0 });
    };

    return NextResponse.json({
      success: true,
      deposit: calculateSummary(depoRes.data),
      withdraw: calculateSummary(wdRes.data)
    });

  } catch (error) {
    console.error("Dashboard API Error:", error.message);
    return NextResponse.json({ 
      success: false, 
      message: error.message || "Fetch Failed" 
    }, { status: 500 });
  }
}