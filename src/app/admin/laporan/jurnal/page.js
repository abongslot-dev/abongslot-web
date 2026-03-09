"use client";
import React from "react";
import { RotateCcw, Search, Table } from "lucide-react";

export default function LaporanJurnalPage() {
  // Data dummy sesuai gambar Bos
  const jurnalData = [
    {
      id: 1,
      tanggal: "10 March 2026",
      depo: "41.665.467,00",
      wd: "26.320.000,00",
      adjPlus: "0,00",
      adjMin: "0,00",
      bonus: "49.425,00",
      cashback: "0,00",
      referral: "0,00",
      rolling: "0,00",
      marketing: "0,00",
      total: "15.394.892,00",
    }
  ];

  return (
    <div className="p-6 text-[#333] font-sans">
      {/* --- JUDUL HALAMAN --- */}
      <h1 className="text-4xl font-normal mb-1 tracking-tight">Laporan Jurnal</h1>
      <p className="text-sm text-blue-500 mb-8 font-medium">
        Dashboard <span className="text-gray-400 font-normal">/ Laporan Jurnal</span>
      </p>

      {/* --- FILTER SECTION --- */}
      <div className="bg-white border border-gray-200 rounded shadow-sm mb-6">
        <div className="bg-gray-50/50 px-4 py-3 border-b border-gray-200 flex items-center gap-2 text-sm font-bold text-gray-700">
          <span className="text-[10px]">▼</span> Filter
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
            <div className="relative">
              <label className="absolute -top-5 left-0 text-[11px] text-gray-500 font-medium">Dari Tanggal</label>
              <input 
                type="date" 
                defaultValue="2026-03-01"
                className="w-full border border-gray-300 p-2.5 text-sm rounded outline-none bg-white focus:border-blue-400" 
              />
            </div>
            <div className="relative">
              <label className="absolute -top-5 left-0 text-[11px] text-gray-500 font-medium">Sampai Tanggal</label>
              <input 
                type="date" 
                defaultValue="2026-03-10"
                className="w-full border border-gray-300 p-2.5 text-sm rounded outline-none bg-white focus:border-blue-400" 
              />
            </div>
          </div>
          <div className="flex gap-1.5 mt-6">
            <button className="bg-[#00c0ef] text-white px-4 py-1.5 rounded text-sm font-medium flex items-center gap-1.5 hover:bg-cyan-600 transition-colors shadow-sm">
              <RotateCcw size={14}/> Reset
            </button>
            <button className="bg-[#007bff] text-white px-4 py-1.5 rounded text-sm font-medium flex items-center gap-1.5 hover:bg-blue-700 transition-colors shadow-sm">
              <Search size={14}/> Cari
            </button>
          </div>
        </div>
      </div>

      {/* --- TABEL LAPORAN JURNAL --- */}
      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
        <div className="bg-gray-50/80 px-4 py-3 border-b border-gray-200 flex items-center gap-2 text-sm font-bold text-gray-700">
          <Table size={16} className="text-gray-600" /> Laporan Jurnal
        </div>
        
        <div className="p-4">
          <div className="overflow-x-auto border border-gray-200 rounded">
            <table className="w-full text-[12px] border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-200 text-gray-800 font-bold text-center">
                  <th className="p-2 border-r border-gray-200 w-10">No.</th>
                  <th className="p-2 border-r border-gray-200 min-w-[100px]">Tanggal</th>
                  <th className="p-2 border-r border-gray-200 min-w-[120px]">
                    Total Deposit<br/><span className="font-normal">(+)</span>
                  </th>
                  <th className="p-2 border-r border-gray-200 min-w-[120px]">
                    Total Withdrawal<br/><span className="font-normal">(-)</span>
                  </th>
                  <th className="p-2 border-r border-gray-200 min-w-[110px]">
                    Total Adjustment<br/><span className="font-normal">(+)</span>
                  </th>
                  <th className="p-2 border-r border-gray-200 min-w-[110px]">
                    Total Adjustment<br/><span className="font-normal">(-)</span>
                  </th>
                  <th className="p-2 border-r border-gray-200 min-w-[100px]">
                    Total Bonus<br/><span className="font-normal">(+)</span>
                  </th>
                  <th className="p-2 border-r border-gray-200 min-w-[100px]">
                    Total Cashback<br/><span className="font-normal">(+)</span>
                  </th>
                  <th className="p-2 border-r border-gray-200 min-w-[100px]">
                    Total Referral<br/><span className="font-normal">(+)</span>
                  </th>
                  <th className="p-2 border-r border-gray-200 min-w-[100px]">
                    Total Rolling<br/><span className="font-normal">(+)</span>
                  </th>
                  <th className="p-2 border-r border-gray-200 min-w-[110px]">
                    Total Marketing<br/><span className="font-normal">(+/-)</span>
                  </th>
                  <th className="p-2 font-bold min-w-[120px]">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-right">
                {jurnalData.map((item, i) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 border-r border-gray-200 text-center font-medium">{i + 1}.</td>
                    <td className="p-3 border-r border-gray-200 text-center leading-tight">
                      {item.tanggal}
                    </td>
                    <td className="p-3 border-r border-gray-200 font-medium">{item.depo}</td>
                    <td className="p-3 border-r border-gray-200 font-medium">{item.wd}</td>
                    <td className="p-3 border-r border-gray-200">{item.adjPlus}</td>
                    <td className="p-3 border-r border-gray-200">{item.adjMin}</td>
                    <td className="p-3 border-r border-gray-200">{item.bonus}</td>
                    <td className="p-3 border-r border-gray-200">{item.cashback}</td>
                    <td className="p-3 border-r border-gray-200">{item.referral}</td>
                    <td className="p-3 border-r border-gray-200">{item.rolling}</td>
                    <td className="p-3 border-r border-gray-200">{item.marketing}</td>
                    <td className="p-3 font-bold text-gray-900">{item.total}</td>
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