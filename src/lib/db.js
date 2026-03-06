import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://hqsahuywehlbwywyzlsz.supabase.co'
const SUPABASE_KEY = 'sb_publishable_PiwkCSc05QG4DjULYyUjTw_0R1uUux6'

// Koneksi utama yang dipanggil oleh halaman admin
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const db = () => supabase;
export default db;