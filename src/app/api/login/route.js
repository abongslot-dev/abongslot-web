import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Pastikan tidak ada spasi tambahan di dalam tanda kutip
const SUPABASE_URL = 'https://hqsahuywehlbwywyzlsz.supabase.co'
const SUPABASE_KEY = 'sb_publishable_PiwkCSc05QG4DjULYyUjTw_0R1uUux6'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export async function POST(req) {
  try {
    const { username, password } = await req.json()

    // Debug log untuk memastikan input masuk
    console.log("Mencoba login untuk:", username)

    const { data: user, error } = await supabase
      .from('members')
      .select('username, password, saldo')
      .eq('username', username)
      .eq('password', password)
      .maybeSingle()

    // Jika ada error dari sisi Supabase
    if (error) {
      console.error("Supabase Error:", error.message)
      return NextResponse.json({ success: false, message: "Database Error: " + error.message }, { status: 500 })
    }

    // Jika user tidak ditemukan
    if (!user) {
      return NextResponse.json({ success: false, message: "Username atau Password salah!" }, { status: 401 })
    }

    // Berhasil Login
    return NextResponse.json({ 
      success: true, 
      username: user.username, 
      saldo: user.saldo 
    }, { status: 200 })

  } catch (err) {
    console.error("Internal Error:", err)
    return NextResponse.json({ success: false, message: "Server Error: Koneksi gagal" }, { status: 500 })
  }
}
