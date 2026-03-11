"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // State untuk form
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

// Tambahkan library cookie (atau pakai document.cookie saja)
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  // LOGIC AUTHENTICATION
  if (formData.username === "admin" && formData.password === "admin123") {
    // Simpan cookie selama 1 hari
    document.cookie = "auth_token=true; path=/; max-age=86400"; 
    
    router.push("/dashboard");
    router.refresh(); // Supaya middleware baca ulang status login
  } else {
    alert("Kredensial Salah!");
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0f001f] relative overflow-hidden">
      
      {/* Efek Cahaya Latar (Aksesoris) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-[400px] p-6 z-10">
        {/* Logo / Judul */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 border border-white/10 rounded-2xl mb-4 shadow-xl">
            <ShieldCheck size={40} className="text-purple-500" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tighter uppercase">
            Admin <span className="text-purple-500">Panel</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Silakan masuk untuk mengelola sistem</p>
        </div>

        {/* Card Login */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Input Username */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="text"
                  required
                  placeholder="Masukkan username"
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition-all"
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-12 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition-all"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Tombol Login */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white font-bold py-3 rounded-xl shadow-lg shadow-purple-900/20 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                "MASUK SEKARANG"
              )}
            </button>

          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-xs mt-8">
          &copy; 2026 AbongSlot Management System. All Rights Reserved.
        </p>
      </div>
    </div>
  );
}