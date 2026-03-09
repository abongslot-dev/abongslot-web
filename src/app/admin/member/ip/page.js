"use client";
import React, { useState } from "react";
import { Search, RotateCcw, Table, FileSpreadsheet } from "lucide-react";

export default function LihatIPPage() {
  const [dataIP, setDataIP] = useState([
    { id: 1, username: "agar2584", ip: "2001:448a:2010:667:101:4883:8259:ce0e", waktu: "10 March 2026, 05:02:09" },
    { id: 2, username: "Mubassir", ip: "103.156.165.80", waktu: "10 March 2026, 05:01:49" },
    { id: 3, username: "marliehoki123", ip: "114.8.197.26", waktu: "10 March 2026, 04:58:56" },
    { id: 4, username: "tolongbos20", ip: "2a09:bac5:55f9:15f::23:46c", waktu: "10 March 2026, 04:56:25" },
    { id: 5, username: "BOCAHANGON", ip: "182.5.243.213", waktu: "10 March 2026, 04:54:45" },
  ]);

  return (
    <div className="p-6 text-[#333] font-sans">
      {/* --- JUDUL HALAMAN --- */}
      <h1 className="text-4xl font-normal mb-1">Lihat IP</h1>
      <p className="text-sm text-blue-500 mb-8 font-medium">
        Dashboard <span className="text-gray-400 font-normal">/ Lihat IP</span>
      </p>

      {/* --- FILTER SECTION --- */}
      <div className="bg-white border border-gray-200 rounded shadow-sm mb-6">
        <div className="bg-gray-50/50 px-4 py-3 border-b border-gray-200 flex items-center gap-2 text-sm font-bold text-gray-700">
          <span className="text-xs">▼</span> Filter
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <input 
                type="text" 
                placeholder="Username" 
                className="w-full border border-gray-300 p-2.5 text-sm rounded outline-none focus:border-blue-400 placeholder-gray-400" 
              />
            </div>
            <div>
              <input 
                type="text" 
                placeholder="IP" 
                className="w-full border border-gray-300 p-2.5 text-sm rounded outline-none focus:border-blue-400 placeholder-gray-400" 
              />
            </div>
            <div className="relative">
              <label className="absolute -top-5 left-0 text-[11px] text-gray-500">Dari Tanggal</label>
              <input 
                type="date" 
                defaultValue="2026-03-10"
                className="w-full border border-gray-300 p-2.5 text-sm rounded outline-none bg-white" 
              />
            </div>
            <div className="relative">
              <label className="absolute -top-5 left-0 text-[11px] text-gray-500">Sampai Tanggal</label>
              <input 
                type="date" 
                defaultValue="2026-03-10"
                className="w-full border border-gray-300 p-2.5 text-sm rounded outline-none bg-white" 
              />
            </div>
          </div>
          <div className="flex gap-1.5">
            <button className="bg-[#00c0ef] text-white px-4 py-1.5 rounded text-sm font-medium flex items-center gap-1.5 hover:bg-cyan-600 transition-colors shadow-sm">
              <RotateCcw size={14}/> Reset
            </button>
            <button className="bg-[#007bff] text-white px-4 py-1.5 rounded text-sm font-medium flex items-center gap-1.5 hover:bg-blue-700 transition-colors shadow-sm">
              <Search size={14}/> Cari
            </button>
          </div>
        </div>
      </div>

      {/* --- TABEL DATA --- */}
      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
        <div className="bg-gray-50/50 px-4 py-3 border-b border-gray-200 flex items-center gap-2 text-sm font-bold text-gray-700">
          <Table size={16} className="text-gray-600"/> Lihat IP
        </div>
        
        <div className="p-4">
          <div className="flex justify-end mb-4">
            <button className="bg-[#28a745] text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 hover:bg-green-700 transition-all shadow-sm">
              <FileSpreadsheet size={14}/> Export
            </button>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded">
            <table className="w-full text-left text-[13px] border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-800 font-bold">
                  <th className="p-3 border-r border-gray-200 text-center w-14">No.</th>
                  <th className="p-3 border-r border-gray-200">Username</th>
                  <th className="p-3 border-r border-gray-200">IP</th>
                  <th className="p-3">Waktu Login</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dataIP.map((item, i) => (
                  <tr key={item.id} className="hover:bg-blue-50/30 transition-colors border-b border-gray-100 last:border-0">
                    <td className="p-3 border-r border-gray-200 text-center text-gray-600">{i + 1}.</td>
                    <td className="p-3 border-r border-gray-200">
                      <a href={`/admin/members/${item.username}`} className="text-blue-600 hover:underline">
                        {item.username}
                      </a>
                    </td>
                    <td className="p-3 border-r border-gray-200 font-mono text-gray-700 text-[12px]">
                      {item.ip}
                    </td>
                    <td className="p-3 text-gray-600">
                      {item.waktu}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}