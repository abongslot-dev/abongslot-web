"use client";
import React, { useState, useEffect } from "react";
import { 
  RotateCcw, 
  Search, 
  Landmark, 
  Filter as FilterIcon 
} from "lucide-react";

// --- KOMPONEN PEMBANTU (Biar Gak Error Not Defined) ---
const FilterSelect = ({ label }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-gray-500 uppercase">{label}</label>
    <select className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
      <option value="">Semua Bank</option>
      <option value="BCA">BCA</option>
      <option value="BNI">BNI</option>
      <option value="BRI">BRI</option>
      <option value="MANDIRI">MANDIRI</option>
      <option value="DANAMON">DANAMON</option>
      <option value="CIMB">CIMB</option>
    </select>
  </div>
);

export default function WithdrawalBaruPage() {
  const [dataWD, setDataWD] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fungsi ambil data dari API
  const fetchWD = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/withdrawals");
      const data = await res.json();
      if (data.success) {
        setDataWD(data.requests || []);
      }
    } catch (error) {
      console.error("Gagal ambil data WD:", error);
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
    // Ambil nama admin pas login
    const savedAdmin = localStorage.getItem("adminName");
    if (savedAdmin) {
      setCurrentAdminName(savedAdmin);
    }
    
    fetchWD(); // Ambil data WD
  }, []);


  // Fungsi Action (Terima / Tolak)
const onAction = async (id, status, user, amount) => {
    // 1. SOLUSI ERROR: Kita definisikan adminName di dalam fungsi
    // Ambil dari state currentAdminName, kalau gak ada ambil dari localStorage
    const adminName = (typeof currentAdminName !== 'undefined' ? currentAdminName : localStorage.getItem("adminName")) || "ADMIN_WEB";
    
    const actionText = status === 'SUCCESS' ? 'Menerima' : 'Menolak';

    if (!confirm(`Yakin ingin ${actionText} WD dari ${user}?`)) return;

    try {
      const res = await fetch('/api/update-wd', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: id, 
          status: status,
          processed_by: adminName, // <--- Ini yang mengisi kolom processed_by di DB
          admin_id: adminName.slice(0, 3).toUpperCase() 
        }),
      });

      const result = await res.json();

      if (result.success) {
        alert(`✅ Berhasil! Diproses oleh: ${adminName}`);
        // Hapus dari list agar tidak menumpuk
        setDataWD((prevData) => prevData.filter((item) => item.id !== id));
      } else {
        alert("❌ Gagal: " + result.message);
      }
    } catch (err) {
      alert("❌ Error: " + err.message); 
    }
  };


  // Fungsi dummy untuk klik user (bisa diarahkan ke detail member nanti)
  const handleUserClick = (user) => {
    alert("Cek detail member: " + user.username);
  };

  return (
    <div className="p-6 text-gray-800">
      <h1 className="text-3xl font-normal mb-1 text-black">Withdrawal Baru</h1>
      <p className="text-xs text-blue-500 mb-6 font-medium">
        Dashboard <span className="text-gray-400 font-normal">/ Withdrawal Baru</span>
      </p>

      {/* FILTER AREA */}
      <div className="bg-[#fcfcfc] border rounded shadow-sm overflow-hidden border-gray-200 mb-6">
        <div className="bg-gray-100 px-4 py-2 border-b flex items-center gap-2 text-[13px] font-bold text-gray-600 uppercase">
          <FilterIcon size={12}/> Filter
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <FilterSelect label="Ke Bank" />
        </div>
        <div className="px-4 pb-4 flex gap-1">
          <button 
            onClick={fetchWD}
            className="bg-[#00c0ef] text-white px-3 py-1.5 rounded text-[11px] font-bold flex items-center gap-1 hover:bg-cyan-600"
          >
            <RotateCcw size={12}/> Reset
          </button>
          <button className="bg-[#007bff] text-white px-3 py-1.5 rounded text-[11px] font-bold flex items-center gap-1 hover:bg-blue-700">
            <Search size={12}/> Cari
          </button>
        </div>
      </div>

      {/* DATA AREA */}
      <div className="bg-white border rounded shadow-sm overflow-hidden">
        <div className="bg-gray-100 px-4 py-2 border-b flex items-center gap-2 text-[13px] font-bold text-gray-600 uppercase">
          <Landmark size={14}/> Antrean Withdrawal
        </div>
        
        <div className="p-4">
          <div className="overflow-x-auto border rounded">
            <table className="w-full text-left text-[11px] border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-800 font-bold uppercase">
                  <th className="p-2 border-r w-8 text-center"><input type="checkbox" /></th>
                  <th className="p-2 border-r text-center w-10">No.</th>
                  <th className="p-2 border-r">Username</th>
                  <th className="p-2 border-r text-right">Total</th>
                  <th className="p-2 border-r">Bank Tujuan</th>
                  <th className="p-2 border-r text-center">Waktu Request</th>
                  <th className="p-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {dataWD.length > 0 ? (
                  dataWD.map((item, index) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50 transition-all">
                      <td className="p-3 border-r text-center"><input type="checkbox"/></td>
                      <td className="p-3 border-r text-center text-gray-400">{index + 1}.</td>
                      <td 
                        className="p-3 border-r text-blue-600 font-bold cursor-pointer hover:underline hover:text-blue-800 uppercase italic"
                        onClick={() => handleUserClick(item)} 
                      >
                        {item.username}
                      </td>
                      <td className="p-3 border-r text-right font-black text-red-600 tracking-tighter text-[13px]">
                        Rp {Number(item.nominal || 0).toLocaleString('id-ID')}
                      </td>
                      <td className="p-3 border-r leading-tight">
                        <div className="font-bold uppercase text-gray-700">{item.bank}</div>
                        <div className="text-blue-500 font-mono text-[10px] bg-blue-50 px-1 rounded inline-block">
                          {item.nomor_rekening}
                        </div>
                        <div className="text-gray-900 font-bold uppercase text-[11px] block mt-0.5">
                          A.N: {item.nama_rekening || "-"}
                        </div>
                      </td>
                      <td className="p-3 border-r text-center text-gray-400">
                        {new Date(item.created_at).toLocaleString('id-ID')}
                      </td>
                      <td className="p-3 flex gap-1 justify-center">
                        <button 
                          onClick={() => onAction(item.id, 'SUCCESS')}
                          className="bg-[#28a745] text-white px-3 py-1.5 rounded-[3px] text-[10px] font-bold hover:bg-green-700 uppercase transition-all"
                        >
                          Terima
                        </button>
                        <button 
                          onClick={() => onAction(item.id, 'REJECT')}
                          className="bg-[#dc3545] text-white px-3 py-1.5 rounded-[3px] text-[10px] font-bold hover:bg-red-700 uppercase transition-all"
                        >
                          Tolak
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-10 text-center text-gray-400 italic font-medium">
                      {loading ? "Sedang memuat antrean..." : "Antrean kosong, belum ada WD baru."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}