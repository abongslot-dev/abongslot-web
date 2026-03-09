"use client";
import React from "react";
import { Search, RotateCcw, Table, Plus } from "lucide-react";

export default function PenyesuaianSaldoPage() {
  return (
    <div className="p-6 text-[#333] font-sans">
      {/* --- JUDUL HALAMAN --- */}
      <h1 className="text-4xl font-normal mb-1 tracking-tight">Penyesuaian Saldo</h1>
      <p className="text-sm text-blue-500 mb-8 font-medium">
        Dashboard <span className="text-gray-400 font-normal">/ Penyesuaian Saldo</span>
      </p>

      {/* --- FILTER SECTION (ATAS) --- */}
      <div className="bg-white border border-gray-200 rounded shadow-sm mb-6">
        <div className="bg-gray-50/50 px-4 py-2 border-b border-gray-200 flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-tight">
          <span className="text-[10px]">▼</span> Filter
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-7">
            <div>
              <input 
                type="text" 
                placeholder="Username" 
                className="w-full border border-gray-300 p-2 text-sm rounded outline-none focus:border-blue-400" 
              />
            </div>
            <div className="relative">
              <label className="absolute -top-5 left-0 text-[11px] text-gray-500">Tipe</label>
              <select className="w-full border border-gray-300 p-2 text-sm rounded outline-none bg-white">
                <option>Pilih</option>
                <option>Tambah</option>
                <option>Kurangi</option>
              </select>
            </div>
            <div className="relative">
              <label className="absolute -top-5 left-0 text-[11px] text-gray-500">Kategori</label>
              <select className="w-full border border-gray-300 p-2 text-sm rounded outline-none bg-white">
                <option>Pilih</option>
              </select>
            </div>
            <div className="relative">
              <label className="absolute -top-5 left-0 text-[11px] text-gray-500">Dari Tanggal</label>
              <input type="date" defaultValue="2026-03-10" className="w-full border border-gray-300 p-2 text-sm rounded outline-none bg-white" />
            </div>
            <div className="relative">
              <label className="absolute -top-5 left-0 text-[11px] text-gray-500">Sampai Tanggal</label>
              <input type="date" defaultValue="2026-03-10" className="w-full border border-gray-300 p-2 text-sm rounded outline-none bg-white" />
            </div>
          </div>
          <div className="flex gap-1.5 mt-4">
            <button className="bg-[#00c0ef] text-white px-4 py-1.5 rounded text-sm font-medium flex items-center gap-1.5 hover:bg-cyan-600 shadow-sm transition-colors">
              <RotateCcw size={14}/> Reset
            </button>
            <button className="bg-[#007bff] text-white px-4 py-1.5 rounded text-sm font-medium flex items-center gap-1.5 hover:bg-blue-700 shadow-sm transition-colors">
              <Search size={14}/> Cari
            </button>
          </div>
        </div>
      </div>

      {/* --- SECTION PENYESUAIAN SALDO (BAWAH) --- */}
      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
        <div className="bg-gray-50/50 px-4 py-2 border-b border-gray-200 flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-tight">
          <Table size={16} className="text-gray-600" /> Penyesuaian Saldo
        </div>
        
        <div className="p-4">
          {/* Ringkasan Total Box */}
          <div className="flex flex-wrap gap-4 mb-6 text-sm">
            <div className="bg-[#f4f4f4] border border-gray-200 p-2.5 rounded min-w-[180px]">
              <p className="text-gray-500 text-xs">Total Ditambah</p>
              <p className="font-bold text-gray-800">Rp. 0</p>
            </div>
            <div className="bg-[#f4f4f4] border border-gray-200 p-2.5 rounded min-w-[180px]">
              <p className="text-gray-500 text-xs">Total Dikurangi</p>
              <p className="font-bold text-gray-800">Rp. 0</p>
            </div>
            <div className="bg-[#f4f4f4] border border-gray-200 p-2.5 rounded min-w-[180px]">
              <p className="text-gray-500 text-xs">Total Penyesuaian</p>
              <p className="font-bold text-gray-800">Rp. 0</p>
            </div>
          </div>

          {/* Form Input Tambah Manual */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 items-end">
            <div>
              <input type="text" placeholder="Username" className="w-full border border-gray-300 p-2 text-sm rounded outline-none" />
            </div>
            <div>
              <select className="w-full border border-gray-300 p-2 text-sm rounded outline-none bg-white">
                <option>Pilih Tipe</option>
                <option>Tambah</option>
                <option>Kurangi</option>
              </select>
            </div>
            <div>
              <select className="w-full border border-gray-300 p-2 text-sm rounded outline-none bg-white">
                <option>Penyesuaian Saldo</option>
              </select>
            </div>
            <div>
              <div className="relative">
                <label className="absolute -top-5 left-0 text-[11px] text-gray-500">Jumlah</label>
                <input type="number" defaultValue="0" className="w-full border border-gray-300 p-2 text-sm rounded outline-none" />
              </div>
            </div>
            <div>
              <input type="text" placeholder="Keterangan" className="w-full border border-gray-300 p-2 text-sm rounded outline-none" />
            </div>
          </div>
          
          <button className="bg-[#28a745] hover:bg-green-700 text-white px-4 py-1.5 rounded text-sm font-medium flex items-center gap-2 mb-8 transition-all shadow-sm">
            <Plus size={14}/> Tambah
          </button>

          {/* Tabel Data */}
          <div className="overflow-x-auto border border-gray-100 rounded">
            <table className="w-full text-left text-[11px] border-collapse font-bold uppercase">
              <thead>
                <tr className="bg-white border-b border-gray-200 text-gray-800">
                  <th className="p-2 border-r border-gray-200 text-center w-12">No.</th>
                  <th className="p-2 border-r border-gray-200">Username</th>
                  <th className="p-2 border-r border-gray-200">Tipe</th>
                  <th className="p-2 border-r border-gray-200">Kategori</th>
                  <th className="p-2 border-r border-gray-200">Keterangan</th>
                  <th className="p-2 border-r border-gray-200">Total</th>
                  <th className="p-2 border-r border-gray-200">Admin</th>
                  <th className="p-2">Waktu Adjustment</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="8" className="p-4 text-center text-gray-500 font-normal bg-gray-50/30">
                    Tidak ada data
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 text-[11px] text-gray-500 text-right italic">
            Menampilkan sampai dari total 0 baris
          </div>
        </div>
      </div>
    </div>
  );
}