import { createClient } from '@supabase/supabase-js'

// Pakai variabel yang sudah kamu buat tadi
const SUPABASE_URL = 'https://hqsahuywehlbwywyzlsz.supabase.co'
const SUPABASE_KEY = 'sb_publishable_PiwkCSc05QG4DjULYyUjTw_0R1uUux6'

// Export variabel 'supabase' agar bisa di-import oleh file lain
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Fungsi pembantu tambahan
const db = () => supabase;
export default db;