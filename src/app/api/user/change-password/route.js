import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// 1. Hubungkan ke Supabase (Pintu Gerbang Cloud)
const SUPABASE_URL = 'https://hqsahuywehlbwywyzlsz.supabase.co'
const SUPABASE_KEY = 'sb_publishable_PiwkCSc05QG4DjULYyUjTw_0R1uUux6'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export async function POST(req) {
  try {
    const { username, oldPassword, newPassword } = await req.json();

    // 2. Cek apakah Password Lama BENAR di Supabase
    const { data: user, error: fetchError } = await supabase
      .from('members')
      .select('id, password')
      .eq('username', username)
      .eq('password', oldPassword) // Supabase secara standar sudah case-sensitive
      .maybeSingle();

    if (fetchError || !user) {
      return NextResponse.json({ 
        success: false, 
        message: "Password lama salah, Bos! Cek lagi." 
      }, { status: 401 });
    }

    // 3. Jika benar, Update ke Password Baru
    const { error: updateError } = await supabase
      .from('members')
      .update({ password: newPassword })
      .eq('username', username);

    if (updateError) throw updateError;

    return NextResponse.json({ 
      success: true, 
      message: "Password berhasil diganti!" 
    }, { status: 200 });

  } catch (error) {
    console.error("SUPABASE ERROR:", error.message);
    return NextResponse.json({ 
      success: false, 
      message: "Sistem gagal update password!" 
    }, { status: 500 });
  }
}
