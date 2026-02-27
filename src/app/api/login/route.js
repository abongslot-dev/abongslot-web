export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// 1. Definisikan langsung di sini agar tidak tergantung file db.js
const SUPABASE_URL = 'https://hqsahuywehlbwywyzlsz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_PiwkCSc05QG4DjULYyUjTw_0R1uUux6';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    // 2. Langsung tembak ke tabel members
    const { data: user, error } = await supabase
      .from('members')
      .select('username, password, saldo')
      .eq('username', username)
      .eq('password', password)
      .maybeSingle();

    if (error) {
      console.error("Supabase Error:", error.message);
      return NextResponse.json({ success: false, message: "Database Down" }, { status: 500 });
    }

    if (!user) {
      return NextResponse.json({ success: false, message: "User/Pass Salah!" }, { status: 401 });
    }

    // 3. Respon sukses
    return NextResponse.json({ 
      success: true, 
      username: user.username, 
      saldo: parseFloat(user.saldo) 
    }, { status: 200 });

  } catch (err) {
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}
