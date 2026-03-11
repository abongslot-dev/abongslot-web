"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, ShieldCheck } from "lucide-react";
import { createClient } from '@supabase/supabase-js';

// Inisialisasi langsung di sini agar proses Build tidak bingung mencari file
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);


export default function AdmLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // PAKAI INI UNTUK SUPABASE AUTHENTICATION
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.username, // Supabase Auth biasanya pakai Email
        password: formData.password,
      });

      if (error) {
        alert("Login Gagal: " + error.message);
        setLoading(false);
        return;
      }

      // Jika berhasil, Supabase otomatis simpan session di LocalStorage
      // Kita tambahkan cookie untuk Middleware kita tadi
      document.cookie = "isLoggedIn=true; path=/";
      
      router.push("/admin/dashboard");
      router.refresh(); // Penting agar layout berubah
      
    } catch (err) {
      alert("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#1a0033]">
      <div className="w-full max-w-[380px] p-6">
        <div className="bg-[#240046] border border-white/10 p-8 rounded-2xl shadow-2xl">
          <div className="text-center mb-8">
            <ShieldCheck size={48} className="text-purple-500 mx-auto mb-2" />
            <h1 className="text-white font-black text-xl tracking-widest uppercase">ADM LOGIN</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="Username"
                required
                className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500"
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-500" size={18} />
              <input 
                type="password" 
                placeholder="Password"
                required
                className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <button 
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-lg mt-4 transition-all disabled:opacity-50"
            >
              {loading ? "MENGECEK DATA..." : "LOGIN SEKARANG"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}