import { createClient } from '@supabase/supabase-js'

// Ambil otomatis dari Environment Variables yang sudah kamu input tadi
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Waduh! URL atau Key Supabase belum terpasang di Env.");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const db = () => supabase;
export default db;