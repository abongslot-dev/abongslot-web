"use client";
import React from "react";
import { RotateCcw, Search, Table, clock } from "lucide-react";

export default function LaporanGameMemberPage() {
  return (
    <div className="p-6 text-[#333] font-sans">
      {/* --- JUDUL HALAMAN --- */}
      <h1 className="text-4xl font-normal mb-1 tracking-tight">Laporan Game Member</h1>
      <p className="text-sm text-blue-500 mb-8 font-medium">
        Dashboard <span className="text-gray-400 font-normal">/ Laporan Game Member</span>
      </p>

      {/* --- FILTER SECTION --- */}
      <div className="bg-white border border-gray-200 rounded shadow-sm mb-6">
        <div className="bg-gray-50/50 px-4 py-3 border-b border-gray-200 flex items-center gap-2 text-sm font-bold text-gray-700">
          <span className="text-[10px]">▼</span> Filter
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-6 mb-4">
            {/* Baris 1 */}
            <div>
              <input 
                type="text" 
                placeholder="Username" 
                className="w-full border border-gray-300 p-2 text-sm rounded outline-none focus:border-blue-400 placeholder-gray-400" 
              />
            </div>
            <div className="relative">
              <label className="absolute -top-5 left-0 text-[11px] text-gray-500 font-medium">Dari Tanggal</label>
              <input 
                type="date" 
                defaultValue="2026-03-10"
                className="w-full border border-gray-300 p-2 text-sm rounded outline-none bg-white" 
              />
            </div>
            <div className="relative">
              <label className="absolute -top-5 left-0 text-[11px] text-gray-500 font-medium">Sampai Tanggal</label>
              <input 
                type="date" 
                defaultValue="2026-03-10"
                className="w-full border border-gray-300 p-2 text-sm rounded outline-none bg-white" 
              />
            </div>
            <div className="relative">
              <label className="absolute -top-5 left-0 text-[11px] text-gray-500 font-medium">Provider</label>
              <select className="w-full border border-gray-300 p-2 text-sm rounded outline-none bg-white appearance-none">
                <option>Semua</option>
                <option>Pragmatic Play</option>
                <option>PG Soft</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <span className="text-[10px]">▼</span>
              </div>
            </div>

            {/* Baris 2 */}
            <div className="relative">
              <label className="absolute -top-5 left-0 text-[11px] text-gray-500 font-medium">Dari Jam</label>
              <input 
                type="time" 
                className="w-full border border-gray-300 p-2 text-sm rounded outline-none bg-white" 
              />
            </div>
            <div className="relative">
              <label className="absolute -top-5 left-0 text-[11px] text-gray-500 font-medium">Sampai Jam</label>
              <input 
                type="time" 
                className="w-full border border-gray-300 p-2 text-sm rounded outline-none bg-white" 
              />
            </div>
            <div className="relative">
              <label className="absolute -top-5 left-0 text-[11px] text-gray-500 font-medium">Tipe</label>
              <select className="w-full border border-gray-300 p-2 text-sm rounded outline-none bg-white appearance-none">
                <option>Semua</option>
                <option>Menang</option>
                <option>Kalah</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <span className="text-[10px]">▼</span>
              </div>
            </div>
          </div>

          <div className="flex gap-1.5 mt-2">
            <button className="bg-[#00c0ef] text-white px-4 py-1.5 rounded text-sm font-medium flex items-center gap-1.5 hover:bg-cyan-600 transition-colors">
              <RotateCcw size={14}/> Reset
            </button>
            <button className="bg-[#007bff] text-white px-4 py-1.5 rounded text-sm font-medium flex items-center gap-1.5 hover:bg-blue-700 transition-colors">
              <Search size={14}/> Cari
            </button>
          </div>
        </div>
      </div>

      {/* --- TABEL SECTION --- */}
      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
        <div className="bg-gray-50/80 px-4 py-3 border-b border-gray-200 flex items-center gap-2 text-sm font-bold text-gray-700">
          <Table size={16} className="text-gray-600" /> Laporan Game Member
        </div>
        
        <div className="p-5">
          {/* ALERT MERAH PERSIS GAMBAR */}
          <div className="bg-[#dd4b39] text-white p-4 rounded text-sm font-normal">
            Masukkan filter Username terlebih dahulu untuk melihat data Member
          </div>
        </div>
      </div>
    </div>
  );
}