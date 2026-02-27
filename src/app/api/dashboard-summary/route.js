export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const SUPABASE_URL = 'https://hqsahuywehlbwywyzlsz.supabase.co'
const SUPABASE_KEY = 'sb_publishable_PiwkCSc05QG4DjULYyUjTw_0R1uUux6'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export async function GET() {
  try {
    // 1. Ambil data Deposit & Withdraw sekaligus
    const [depoRes, wdRes] = await Promise.all([
      supabase.from('deposits').select('status, nominal'),
      supabase.from('withdrawals').select('status, nominal')
    ]);

    if (depoRes.error) throw depoRes.error;
    if (wdRes.error) throw wdRes.error;

    // 2. Fungsi hitung summary manual (Karena Supabase client lebih simpel)
    const calculateSummary = (data) => {
      return data.reduce((acc, curr) => {
        const status = (curr.status || 'pending').toLowerCase();
        const nominal = parseFloat(curr.nominal || 0);

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
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
