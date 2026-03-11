"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar"; 
import { User, ChevronDown, LogOut, UserCircle } from "lucide-react"; 
import { useRouter } from "next/navigation"; 
import { createClient } from '@supabase/supabase-js'; // Tambahkan ini

// Inisialisasi Supabase di luar agar stabil
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // Penyelamat Hydration Error

  // Pastikan komponen sudah nempel di browser sebelum render hal-hal aneh
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = async () => {
    const confirm = window.confirm("Yakin ingin keluar?");
    if (confirm) {
      // 1. Logout resmi dari Supabase (Ini paling penting!)
      await supabase.auth.signOut();
      
      // 2. Hapus cookie manual
      document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      
      // 3. Pindah halaman pake window.location biar bersih total (Anti-Mental)
      window.location.href = "/login"; 
    }
  };

  // Jika belum 'mounted', jangan render dulu biar nggak Exception Error
  if (!isMounted) {
    return <div className="h-screen w-full bg-[#1a0033]"></div>;
  }

  return (
    <div className="flex h-screen w-full bg-[#1a0033] overflow-hidden font-sans text-white">
      <Sidebar isOpen={isOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-12 bg-[#1a0033] flex items-center px-4 border-b border-white/10 shadow-md">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors">
            <span className="text-xl">☰</span>
          </button>

          <div className="ml-auto flex items-center gap-4">
            {/* Widget Saldo */}
            <div className="bg-[#2c3036] flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 shadow-inner">
              <div className="w-5 h-5 bg-gradient-to-b from-yellow-300 to-yellow-600 rounded-full flex items-center justify-center text-[9px] text-[#1a0033] font-black">
                Rp
              </div>
              <span className="text-gray-300 font-bold text-[13px] tracking-wide">
                256.375.664,00
              </span>
            </div>

            {/* USER DROPDOWN */}
            <div className="relative">
              <button 
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-all py-1 px-2 rounded-lg hover:bg-white/5"
              >
                <div className="bg-white/10 p-1 rounded-full border border-white/10">
                  <User size={18} className="text-gray-200" />
                </div>
                <ChevronDown size={14} className={`transition-transform ${showProfile ? 'rotate-180' : ''}`} />
              </button>

              {showProfile && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)}></div>
                  <div className="absolute right-0 mt-3 w-44 bg-white rounded shadow-2xl border border-gray-200 z-50 overflow-hidden">
                    <button 
                      onClick={() => {
                        router.push('/admin/profile'); // Sesuaikan dengan route profil Bos
                        setShowProfile(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[13px] text-gray-700 hover:bg-gray-50 border-b border-gray-100 text-left"
                    >
                      <UserCircle size={17} className="text-gray-400" />
                      Profil
                    </button>

                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[13px] text-red-600 hover:bg-red-50 font-medium text-left"
                    >
                      <LogOut size={17} />
                      Keluar
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-white text-black">
          {children}
        </main>
      </div>
    </div>
  );
}