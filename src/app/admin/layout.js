"use client";
import React, { useState } from "react";
import Sidebar from "./Sidebar"; 
import { User, ChevronDown, LogOut, UserCircle } from "lucide-react"; // Import icon pendukung
import { useRouter } from "next/navigation"; // Gunakan next/navigation untuk App Router

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [showProfile, setShowProfile] = useState(false); // State untuk dropdown profil

  return (
    <div className="flex h-screen w-full bg-[#1a0033] overflow-hidden font-sans">
      <Sidebar isOpen={isOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER CUSTOM SESUAI GAMBAR */}
        <header className="h-12 bg-[#1a0033] flex items-center px-4 border-b border-white/10 shadow-md">
          {/* Tombol Sidebar */}
          <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors">
            <span className="text-xl">☰</span>
          </button>

          {/* Bagian Kanan: Saldo & User Menu */}
          <div className="ml-auto flex items-center gap-4">
            
            {/* Widget Saldo (Mirip Gambar) */}
            <div className="bg-[#2c3036] flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 shadow-inner select-none">
              <div className="w-5 h-5 bg-gradient-to-b from-yellow-300 to-yellow-600 rounded-full flex items-center justify-center text-[9px] text-[#1a0033] font-black border border-yellow-200 shadow-sm">
                Rp
              </div>
              <span className="text-gray-300 font-bold text-[13px] tracking-wide">
                256.375.664,00
              </span>
            </div>

{/* USER DROPDOWN SECTION */}
            <div className="relative">
              <button 
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-all py-1 px-2 rounded-lg hover:bg-white/5"
              >
                <div className="bg-white/10 p-1 rounded-full border border-white/10">
                  <User size={18} className="text-gray-200" />
                </div>
                <ChevronDown 
                  size={14} 
                  className={`text-gray-500 transition-transform duration-300 ${showProfile ? 'rotate-180' : ''}`} 
                />
              </button>

              {/* Box Dropdown (Muncul saat diklik) */}
              {showProfile && (
                <>
                  {/* Overlay untuk nutup menu kalau klik di luar area menu */}
                  <div 
                    className="fixed inset-0 z-40 cursor-default" 
                    onClick={() => setShowProfile(false)}
                  ></div>
                  
                  <div className="absolute right-0 mt-3 w-44 bg-white rounded shadow-2xl border border-gray-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    
                    {/* TOMBOL KE PROFIL */}
                    <button 
                      onClick={() => {
                        router.push('/profil'); // PINDAH KE HALAMAN PROFIL
                        setShowProfile(false);  // TUTUP MENU
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[13px] text-gray-700 hover:bg-gray-50 border-b border-gray-100 transition-colors text-left"
                    >
                      <UserCircle size={17} className="text-gray-400" />
                      Profil
                    </button>

                    {/* TOMBOL KELUAR */}
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[13px] text-red-600 hover:bg-red-50 transition-colors font-medium text-left"
                    >
                      <LogOut size={17} />
                      Keluar
                    </button>

                  </div>
                </>
              )}
            </div>
            {/* END USER DROPDOWN */}

          </div>
        </header>

        {/* AREA KONTEN UTAMA */}
        <main className="flex-1 overflow-y-auto bg-white text-black">
          {children}
        </main>
      </div>
    </div>
  );
}