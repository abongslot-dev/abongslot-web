import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://hqsahuywehlbwywyzlsz.supabase.co'
const SUPABASE_KEY = 'sb_publishable_PiwkCSc05QG4DjULYyUjTw_0R1uUux6'

// Buat satu koneksi pusat yang bisa dipakai di mana saja
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Kita buat fungsi default agar kodingan lama tidak error
const db = () => supabase;
export default db;
