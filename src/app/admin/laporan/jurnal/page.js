"use client";
import React, { useState, useEffect } from "react";
import { RotateCcw, Search, Table } from "lucide-react";

export default function LaporanJurnalPage() {
  const [jurnalData, setJurnalData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // State untuk Filter Tanggal
  const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);

 // Fungsi ambil data dari API - VERSI AMAN
  const fetchJurnal = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/reports/jurnal?from=${fromDate}&to=${toDate}`);
      
      // 1. CEK STATUS: Jika bukan 200, jangan dipaksa .json()
      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }

      const result = await response.json();
      
      // 2. PASTIKAN DATA ADALAH ARRAY
      if (result && result.success && Array.isArray(result.data)) {
        setJurnalData(result.data);
      } else {
        setJurnalData([]); // Jika format salah, amankan dengan array kosong
      }
    } catch (error) {
      console.error("Gagal narik data jurnal:", error);
      setJurnalData([]); // JANGAN biarkan data undefined agar tidak crash saat render
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
            <table className="w-full text-[15px] border-collapse">
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
                  <tr>
                    <td colSpan="12" className="p-10 text-center text-gray-400">
                      {loading ? "Sedang menarik data..." : "Data tidak ditemukan untuk periode ini."}
                    </td>
                  </tr>
                ) : (
                  jurnalData.map((item, i) => {
                    const rawTotal = typeof item.total === 'string' 
                      ? parseFloat(item.total.replace(/\./g, '').replace(',', '.')) 
                      : item.total;

                    return (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="p-3 border-r border-gray-200 text-center font-medium text-gray-400">{i + 1}.</td>
                        <td className="p-3 border-r border-gray-200 text-center">{item.tanggal}</td>
                        <td className="p-3 border-r border-gray-200 font-medium text-emerald-600">{item.depo}</td>
                        <td className="p-3 border-r border-gray-200 font-medium text-rose-600">{item.wd}</td>
                        <td className="p-3 border-r border-gray-200">{item.adjPlus}</td>
                        <td className="p-3 border-r border-gray-200">{item.adjMin}</td>
                        <td className="p-3 border-r border-gray-200">{item.bonus}</td>
                        <td className="p-3 border-r border-gray-200">{item.cashback}</td>
                        <td className="p-3 border-r border-gray-200">{item.referral}</td>
                        <td className="p-3 border-r border-gray-200">{item.rolling}</td>
                        <td className="p-3 border-r border-gray-200">{item.marketing}</td>
                        <td className={`p-3 font-bold ${rawTotal < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                          {item.total}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              {/* --- FOOTER TOTAL OTOMATIS --- */}
              {jurnalData.length > 0 && (
                <tfoot className="bg-gray-50 font-bold text-right border-t-2 border-gray-300">
                  <tr>
                    <td colSpan="2" className="p-3 border-r border-gray-200 text-center">TOTAL</td>
                    <td className="p-3 border-r border-gray-200 text-emerald-600">
                      Rp. {formatAngka(jurnalData.reduce((acc, curr) => acc + parseFloat(curr.depo?.replace(/\./g, '').replace(',', '.') || 0), 0))}
                    </td>
                    <td className="p-3 border-r border-gray-200 text-rose-600">
                      Rp. {formatAngka(jurnalData.reduce((acc, curr) => acc + parseFloat(curr.wd?.replace(/\./g, '').replace(',', '.') || 0), 0))}
                    </td>
                    <td className="p-3 border-r border-gray-200">
                      Rp. {formatAngka(jurnalData.reduce((acc, curr) => acc + parseFloat(curr.adjPlus?.replace(/\./g, '').replace(',', '.') || 0), 0))}
                    </td>
                    <td className="p-3 border-r border-gray-200">
                      Rp. {formatAngka(jurnalData.reduce((acc, curr) => acc + parseFloat(curr.adjMin?.replace(/\./g, '').replace(',', '.') || 0), 0))}
                    </td>
                    <td className="p-3 border-r border-gray-200">
                      Rp. {formatAngka(jurnalData.reduce((acc, curr) => acc + parseFloat(curr.bonus?.replace(/\./g, '').replace(',', '.') || 0), 0))}
                    </td>
                    <td className="p-3 border-r border-gray-200">
                      Rp. {formatAngka(jurnalData.reduce((acc, curr) => acc + parseFloat(curr.cashback?.replace(/\./g, '').replace(',', '.') || 0), 0))}
                    </td>
                    <td className="p-3 border-r border-gray-200">
                      Rp. {formatAngka(jurnalData.reduce((acc, curr) => acc + parseFloat(curr.referral?.replace(/\./g, '').replace(',', '.') || 0), 0))}
                    </td>
                    <td className="p-3 border-r border-gray-200">
                      Rp. {formatAngka(jurnalData.reduce((acc, curr) => acc + parseFloat(curr.rolling?.replace(/\./g, '').replace(',', '.') || 0), 0))}
                    </td>
                    <td className="p-3 border-r border-gray-200">
                      Rp. {formatAngka(jurnalData.reduce((acc, curr) => acc + parseFloat(curr.marketing?.replace(/\./g, '').replace(',', '.') || 0), 0))}
                    </td>
                    <td className="p-3 text-emerald-700">
                      Rp. {formatAngka(jurnalData.reduce((acc, curr) => acc + parseFloat(curr.total?.replace(/\./g, '').replace(',', '.') || 0), 0))}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}