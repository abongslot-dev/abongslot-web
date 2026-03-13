"use client";
import React, { useState, useEffect } from "react";
import { RotateCcw, Search, Table } from "lucide-react";

export default function LaporanJurnalPage() {
  const [jurnalData, setJurnalData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // State untuk Filter Tanggal
  const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);

  // Fungsi ambil data dari API
  const fetchJurnal = async () => {
    setLoading(true);
    try {
      // Kita kirim parameter tanggal ke API
      const response = await fetch(`/api/reports/jurnal?from=${fromDate}&to=${toDate}`);
      const result = await response.json();
      if (result.success) {
        setJurnalData(result.data);
      }
    } catch (error) {
      console.error("Gagal narik data jurnal:", error);
    } finally {
      setLoading(false);
    }
  };

  // Jalankan saat pertama kali buka
  useEffect(() => {
    fetchJurnal();
  }, []);

  const formatAngka = (num) => {
    return new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 2,
    }).format(num || 0);
  };

  return (
    <div className="p-6 text-[#333] font-sans">
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
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full border border-gray-300 p-2.5 text-sm rounded outline-none bg-white focus:border-blue-400" 
              />
            </div>
            <div className="relative">
              <label className="absolute -top-5 left-0 text-[11px] text-gray-500 font-medium">Sampai Tanggal</label>
              <input 
                type="date" 
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full border border-gray-300 p-2.5 text-sm rounded outline-none bg-white focus:border-blue-400" 
              />
            </div>
          </div>
          <div className="flex gap-1.5 mt-6">
            <button 
              onClick={() => { setFromDate(''); setToDate(''); }}
              className="bg-[#00c0ef] text-white px-4 py-1.5 rounded text-sm font-medium flex items-center gap-1.5 hover:bg-cyan-600 transition-colors shadow-sm"
            >
              <RotateCcw size={14}/> Reset
            </button>
            <button 
              onClick={fetchJurnal}
              disabled={loading}
              className="bg-[#007bff] text-white px-4 py-1.5 rounded text-sm font-medium flex items-center gap-1.5 hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
            >
              <Search size={14}/> {loading ? 'Loading...' : 'Cari'}
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
                  <th className="p-2 border-r border-gray-200 min-w-[120px]">Total Deposit<br/><span className="font-normal">(+)</span></th>
                  <th className="p-2 border-r border-gray-200 min-w-[120px]">Total Withdrawal<br/><span className="font-normal">(-)</span></th>
                  <th className="p-2 border-r border-gray-200 min-w-[110px]">Total Adjustment<br/><span className="font-normal">(+)</span></th>
                  <th className="p-2 border-r border-gray-200 min-w-[110px]">Total Adjustment<br/><span className="font-normal">(-)</span></th>
                  <th className="p-2 border-r border-gray-200 min-w-[100px]">Total Bonus<br/><span className="font-normal">(+)</span></th>
                  <th className="p-2 border-r border-gray-200 min-w-[100px]">Total Cashback<br/><span className="font-normal">(+)</span></th>
                  <th className="p-2 border-r border-gray-200 min-w-[100px]">Total Referral<br/><span className="font-normal">(+)</span></th>
                  <th className="p-2 border-r border-gray-200 min-w-[100px]">Total Rolling<br/><span className="font-normal">(+)</span></th>
                  <th className="p-2 border-r border-gray-200 min-w-[110px]">Total Marketing<br/><span className="font-normal">(+/-)</span></th>
                  <th className="p-2 font-bold min-w-[120px]">Total (Win/Loss)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-right">
                {jurnalData.length === 0 ? (
                  <tr><td colSpan="12" className="p-10 text-center text-gray-400">Data tidak ditemukan untuk periode ini.</td></tr>
                ) : (
                  jurnalData.map((item, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="p-3 border-r border-gray-200 text-center font-medium">{i + 1}.</td>
                      <td className="p-3 border-r border-gray-200 text-center">{item.tanggal}</td>
                      <td className="p-3 border-r border-gray-200 font-medium text-emerald-600">{formatAngka(item.depo)}</td>
                      <td className="p-3 border-r border-gray-200 font-medium text-rose-600">{formatAngka(item.wd)}</td>
                      <td className="p-3 border-r border-gray-200">{formatAngka(item.adjPlus)}</td>
                      <td className="p-3 border-r border-gray-200">{formatAngka(item.adjMin)}</td>
                      <td className="p-3 border-r border-gray-200">{formatAngka(item.bonus)}</td>
                      <td className="p-3 border-r border-gray-200">{formatAngka(item.cashback)}</td>
                      <td className="p-3 border-r border-gray-200">{formatAngka(item.referral)}</td>
                      <td className="p-3 border-r border-gray-200">{formatAngka(item.rolling)}</td>
                      <td className="p-3 border-r border-gray-200">{formatAngka(item.marketing)}</td>
                      <td className={`p-3 font-bold ${parseFloat(item.total) < 0 ? 'text-rose-600' : 'text-gray-900'}`}>
                        {formatAngka(item.total)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}