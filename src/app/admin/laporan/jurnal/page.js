"use client";
import React, { useState, useEffect } from "react";
import { RotateCcw, Search, Table as TableIcon } from "lucide-react";

export default function LaporanJurnalPage() {
  const [jurnalData, setJurnalData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // State Tanggal (Default hari ini)
  const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchJurnal = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/reports/jurnal?from=${fromDate}&to=${toDate}`);
      
      // JARING PENGAMAN: Cek jika response bukan JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server mengirim respon bukan JSON (Error 500)");
      }

      const result = await response.json();
      if (result.success) {
        setJurnalData(result.data || []);
      } else {
        setJurnalData([]);
      }
    } catch (error) {
      console.error("Gagal narik data jurnal:", error);
      setJurnalData([]); // Set kosong jika error agar tidak crash
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJurnal();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* HEADER */}
        <div className="p-4 border-b bg-gray-100 flex items-center gap-2 font-bold text-gray-700">
          <TableIcon size={20} />
          <span>Laporan Jurnal</span>
        </div>

        {/* FILTER BOX */}
        <div className="p-4 border-b flex flex-wrap gap-4 items-end bg-white">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">DARI TANGGAL</label>
            <input 
              type="date" 
              className="border p-2 rounded text-sm outline-none focus:ring-2 focus:ring-blue-500"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">SAMPAI TANGGAL</label>
            <input 
              type="date" 
              className="border p-2 rounded text-sm outline-none focus:ring-2 focus:ring-blue-500"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <button 
            onClick={fetchJurnal}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm flex items-center gap-2 transition"
          >
            {loading ? <RotateCcw className="animate-spin" size={16} /> : <Search size={16} />}
            CARI
          </button>
        </div>

        {/* TABEL */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b text-gray-600">
                <th className="p-3 border-r w-12 text-center">No.</th>
                <th className="p-3 border-r min-w-[120px]">Tanggal</th>
                <th className="p-3 border-r text-right bg-blue-50">Total Deposit (+)</th>
                <th className="p-3 border-r text-right bg-red-50">Total Withdrawal (-)</th>
                <th className="p-3 border-r text-right">Total Adjustment (+)</th>
                <th className="p-3 border-r text-right">Total Adjustment (-)</th>
                <th className="p-3 border-r text-right">Total Bonus (+)</th>
                <th className="p-3 border-r text-right">Total Cashback (+)</th>
                <th className="p-3 border-r text-right">Total Referral (+)</th>
                <th className="p-3 border-r text-right">Total Rolling (+)</th>
                <th className="p-3 border-r text-right">Total Marketing (+/-)</th>
                <th className="p-3 text-right font-bold bg-green-50">Total</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="12" className="p-10 text-center text-gray-400 italic">Sedang memuat data...</td></tr>
              ) : jurnalData.length > 0 ? (
                jurnalData.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50 transition">
                    <td className="p-3 border-r text-center text-gray-500">{index + 1}.</td>
                    <td className="p-3 border-r font-medium text-gray-700">{item.tanggal}</td>
                    <td className="p-3 border-r text-right text-blue-600 font-medium">{item.depo}</td>
                    <td className="p-3 border-r text-right text-red-600 font-medium">{item.wd}</td>
                    <td className="p-3 border-r text-right">{item.adjPlus}</td>
                    <td className="p-3 border-r text-right">{item.adjMin}</td>
                    <td className="p-3 border-r text-right">{item.bonus}</td>
                    <td className="p-3 border-r text-right text-orange-600">{item.cashback}</td>
                    <td className="p-3 border-r text-right">{item.referral}</td>
                    <td className="p-3 border-r text-right">{item.rolling}</td>
                    <td className="p-3 border-r text-right">{item.marketing}</td>
                    <td className={`p-3 text-right font-bold ${parseFloat(item.total?.replace(/\./g, '').replace(',', '.')) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {item.total}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="12" className="p-10 text-center text-gray-400">Tidak ada data untuk periode ini.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}