import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// 1. MASUKKAN DATA DARI SETTINGS > API SUPABASE DISINI
const SUPABASE_URL = 'https://hqsahuywehlbwywyzlsz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_PiwkCSc05QG4DjULYyUjTw_0R1uUux6'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export async function POST(req) {
  try {
    const { username, password } = await req.json()

    // 2. Query ke tabel members yang baru kamu buat tadi
    const { data, error } = await supabase
      .from('members')
      .select('username, password, saldo')
      .eq('username', username)
      .eq('password', password)
      .single()

    // 3. Cek apakah user ketemu dan password cocok
    if (error || !data) {
      return NextResponse.json({ 
        success: false, 
        message: "Username atau Password salah, Bos!" 
      }, { status: 401 })
    }

    // 4. Jika sukses, kirim data ke frontend
    return NextResponse.json({ 
      success: true, 
      username: data.username, 
      saldo: data.saldo 
    }, { status: 200 })

  } catch (err) {
    console.error("LOGIN_ERROR:", err)
    return NextResponse.json({ 
      success: false, 
      message: "Terjadi kesalahan pada server database" 
    }, { status: 500 })
  }
}
