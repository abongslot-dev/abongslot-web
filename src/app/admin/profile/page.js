"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutGrid, Key, ArrowLeft, Save } from "lucide-react";

export default function ProfilPage() {
  const router = useRouter();
  
  // State untuk checkbox notifikasi
  const [notifDepo, setNotifDepo] = useState(true);
  const [notifTogel, setNotifTogel] = useState(true);

  return (
    <div className="p-6 bg-[#f4f6f9] min-h-screen font-sans text-gray-800">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-medium text-gray-900">Profil</h1>
          <nav className="text-sm mt-1">
            <span 
              className="text-blue-600 cursor-pointer hover:underline" 
              onClick={() => router.push('/dashboard')}
            >
              Dashboard
            </span>
            <span className="text-gray-400 mx-2">/</span>
            <span className="text-gray-500">Profil</span>
          </nav>
        </div>

        {/* Main Card */}
        <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
          {/* Card Header */}
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center gap-2">
            <LayoutGrid size={16} className="text-gray-600" />
            <span className="text-sm font-bold text-gray-700">Profil</span>
          </div>

          {/* Card Body */}
          <div className="p-6 max-w-2xl">
            <div className="space-y-4">
              
              {/* Input Nama */}
              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">Nama</label>
                <input 
                  type="text" 
                  value="MARKUS E.N." 
                  disabled 
                  className="w-full p-2.5 bg-[#eceff1] border border-gray-300 rounded text-sm font-medium text-gray-700"
                />
              </div>

              {/* Input Email */}
              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">Email</label>
                <input 
                  type="email" 
                  value="markusrasoi930@gmail.com" 
                  disabled 
                  className="w-full p-2.5 bg-[#eceff1] border border-gray-300 rounded text-sm font-medium text-gray-700"
                />
              </div>

              {/* Input Status */}
              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">Status</label>
                <input 
                  type="text" 
                  value="Aktif" 
                  disabled 
                  className="w-full p-2.5 bg-[#eceff1] border border-gray-300 rounded text-sm font-medium text-gray-700"
                />
              </div>

              {/* Checkbox Notifikasi */}
              <div className="pt-2">
                <label className="text-[11px] font-bold text-gray-500 uppercase block mb-2">Notifikasi</label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={notifDepo} 
                      onChange={() => setNotifDepo(!notifDepo)}
                      className="w-4 h-4 accent-blue-600"
                    />
                    <span className="text-[13px] font-medium text-gray-700 group-hover:text-blue-600 transition-colors">Depo & WD</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={notifTogel} 
                      onChange={() => setNotifTogel(!notifTogel)}
                      className="w-4 h-4 accent-blue-600"
                    />
                    <span className="text-[13px] font-medium text-gray-700 group-hover:text-blue-600 transition-colors">Togel</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-[12px] font-bold flex items-center gap-2 transition-all shadow-sm">
                  Simpan
                </button>

                <button className="bg-[#198754] hover:bg-[#157347] text-white px-4 py-2 rounded text-[12px] font-bold flex items-center gap-2 transition-all shadow-sm">
                  <Key size={14} />
                  Ubah Password
                </button>

                <button 
                  onClick={() => router.back()}
                  className="bg-[#ffc107] hover:bg-[#ffb300] text-black px-4 py-2 rounded text-[12px] font-bold flex items-center gap-2 transition-all shadow-sm"
                >
                  Kembali
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}