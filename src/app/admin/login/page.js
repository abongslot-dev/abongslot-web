"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase"; // <--- Pastikan path config supabase ini benar

export default function AdmLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // AMBIL DATA DARI SUPABASE
      // Kita cari di tabel 'admins' yang username & passwordnya cocok
      const { data: admin, error } = await supabase
        .from("admins") // <--- Sesuaikan dengan nama tabel Bos di Supabase
        .select("*")
        .eq("username", formData.username)
        .eq("password", formData.password)
        .single();

      if (error || !admin) {
        alert("Username atau Password Salah, Bos!");
        setLoading(false);
        return;
      }

      // Jika Berhasil: Set cookie/session
      document.cookie = "isLoggedIn=true; path=/";
      router.push("/dashboard");
      
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi ke database");
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