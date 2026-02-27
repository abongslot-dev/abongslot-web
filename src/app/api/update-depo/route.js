export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// 1. Koneksi Supabase
const SUPABASE_URL = 'https://hqsahuywehlbwywyzlsz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_PiwkCSc05QG4DjULYyUjTw_0R1uUux6';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- UNTUK TERIMA/TOLAK (POST) ---
export async function POST(req) {
  try {
    const body = await req.json();
    
    // A. LOGIKA UNTUK INSERT DATA BARU (MEMBER)
    if (!body.id) {
      const { error: insErr } = await supabase
        .from('deposits')
        .insert([{ 
          username: body.username, 
          nominal: parseFloat(body.nominal), 
          bank_tujuan: body.bank_tujuan || '',
          status: 'pending' 
        }]);

      if (insErr) throw insErr;
      return NextResponse.json({ success: true });
    }

    // B. LOGIKA UPDATE STATUS (ADMIN)
    const finalStatus = (body.status === 'SUCCESS' || body.status === 'approve' || body.status === 'APPROVED') ? 'approve' : 'reject';

    // 1. Update Status Deposit
    const { error: updErr } = await supabase
      .from('deposits')
      .update({ 
        status: finalStatus, 
        processed_at: new Date().toISOString() 
      })
      .eq('id', body.id);

    if (updErr) throw updErr;

    // 2. Tambah Saldo Member jika status 'approve'
    if (finalStatus === 'approve') {
      // Ambil saldo lama dulu
      const { data: userData, error: userErr } = await supabase
        .from('members')
        .select('saldo')
        .eq('username', body.username)
        .single();

      if (userData) {
        const saldoBaru = parseFloat(userData.saldo || 0) + parseFloat(body.nominal);
        
        // Update saldo ke Sup
