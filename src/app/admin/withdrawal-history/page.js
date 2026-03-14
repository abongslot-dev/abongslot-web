"use client";
import React, { useState, useEffect } from "react";
import { RotateCcw, Search, FileBarChart } from "lucide-react";

export default function RangkumanWithdrawalPage() {
  const [data, setData] = useState([]);
  const [totalWD, setTotalWD] = useState(0);
  const [loading, setLoading] = useState(true);

  // --- LOGIKA PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage) || 1;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Ambil Data dari API
const fetchRangkuman = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/update-wd?t=${Date.now()}`);
      const result = await res.json();
      
      if (result.success && result.data) {
        // --- FILTER DATA HARI INI (WIB) ---
        const now = new Date();
        const wibDateString = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });
        const startOfTodayWIB = new Date(`${wibDateString}T00:00:00+07:00`).getTime();

        const historyData = result.data.filter(item => {
          const itemTime = new Date(item.created_at).getTime();
          // Filter hanya yang HARI INI dan status BUKAN PENDING
          return itemTime >= startOfTodayWIB && item.status !== 'PENDING';
        });

        setData(historyData);
        
        // Hitung total khusus yang statusnya SUCCESS (Hari Ini Saja)
        const totalSukses = historyData
          .filter(item => ['SUCCESS', 'APPROVE', 'SUKSES'].includes(item.status?.toUpperCase()))
          .reduce((acc, curr) => acc + Number(curr.nominal || 0), 0);
        
        setTotalWD(totalSukses);
      }
    } catch (err) {
      console.error("Gagal load data rangkuman", err);
    } finally {
      setLoading(false);
    }
  };

// --- LOGIKA AUTO REFRESH TIAP 30 DETIK ---
  useEffect(() => {
    fetchRangkuman(); // Ambil pertama kali

    const interval = setInterval(() => {
      fetchRangkuman();
    }, 30000); // 30 detik

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 text-gray-800">
      {/* --- JUDUL HALAMAN --- */}
      <h1 className="text-3xl font-normal mb-1 tracking-tight text-black">Rangkuman Withdrawal</h1>
      <p className="text-[11px] text-blue-500 mb-6 font-medium">
        Dashboard <span className="text-gray-400 font-normal">/ Rangkuman Withdrawal</span>
      </p>

      {/* --- FILTER AREA --- */}
      <div className="bg-[#fcfcfc] border rounded shadow-sm overflow-hidden border-gray-200 mb-6">
        <div className="bg-gray-100 px-4 py-2 border-b flex items-center gap-2 text-[12px] font-bold text-gray-600 uppercase">
          <span className="text-[10px]">▼</span> Filter Histori
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-[10px] font-bold mb-1 block uppercase text-gray-400">Username</label>
            <input type="text" placeholder="Cari Username..." className="w-full border p-2 text-xs rounded outline-none focus:border-blue-400 bg-white" />
          </div>
          <div>
            <label className="text-[10px] font-bold mb-1 block uppercase text-gray-400">Ke Bank</label>
            <select className="w-full border p-2 text-xs rounded outline-none bg-white font-medium text-gray-600">
              <option value="">Semua Bank</option>
              <option value="BCA">BCA</option>
              <option value="BNI">BNI</option>
              <option value="MANDIRI">MANDIRI</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold mb-1 block uppercase text-gray-400">Mulai Tanggal</label>
            <input type="date" className="w-full border p-2 text-xs rounded outline-none bg-white" />
          </div>
          <div>
            <label className="text-[10px] font-bold mb-1 block uppercase text-gray-400">Sampai Tanggal</label>
            <input type="date" className="w-full border p-2 text-xs rounded outline-none bg-white" />
          </div>
        </div>
        <div className="px-4 pb-4 flex gap-1">
          <button onClick={fetchRangkuman} className="bg-[#00c0ef] text-white px-3 py-1.5 rounded text-[11px] font-bold flex items-center gap-1 hover:bg-cyan-600">
            <RotateCcw size={12}/> Reset
          </button>
          <button className="bg-[#007bff] text-white px-3 py-1.5 rounded text-[11px] font-bold flex items-center gap-1 hover:bg-blue-700">
            <Search size={12}/> Cari
          </button>
        </div>
      </div>

      {/* --- DATA AREA --- */}
      <div className="bg-white border rounded shadow-sm overflow-hidden border-gray-200">
        <div className="bg-gray-100 px-4 py-2 border-b flex items-center gap-2 text-[12px] font-bold text-gray-600 uppercase">
          <FileBarChart size={14}/> Histori Transaksi WD
        </div>
        
        <div className="p-4">
          {/* BOX TOTAL WD (Warna Merah Halus karena WD adalah pengeluaran) */}
          <div className="bg-red-50 p-4 rounded border border-red-100 w-full md:w-64 mb-6 shadow-sm">
            <p className="text-[10px] text-red-600 font-bold uppercase tracking-wider">Total Berhasil WD</p>
            <p className="text-2xl font-black text-red-700">
              Rp {Number(totalWD).toLocaleString('id-ID')}
            </p>
          </div>

          <div className="overflow-x-auto border rounded border-gray-100">
            <table className="w-full text-left text-[11px] border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b bg-[#f9fafb] text-gray-700 font-bold uppercase">
                  <th className="p-3 border-r text-center w-12">No.</th>
                  <th className="p-3 border-r">Username</th>
                  <th className="p-3 border-r text-right">Nominal WD</th>
                  <th className="p-3 border-r">Tujuan Bank</th>
                  <th className="p-3 border-r text-center">Waktu Request</th>
                  <th className="p-3 border-r text-center">Status</th>
                  <th className="p-3 text-center">Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan="7" className="p-10 text-center italic">Mengambil data dari server...</td></tr>
                ) : data.length === 0 ? (
                  <tr><td colSpan="7" className="p-10 text-center text-gray-400 italic">Belum ada riwayat withdrawal.</td></tr>
                ) : (
                  currentItems.map((item, i) => {
                    const isSuccess = item.status === 'SUCCESS';
                    return (
                      <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="p-3 border-r text-center font-medium text-gray-400">{indexOfFirstItem + i + 1}.</td>
                        <td className="p-3 border-r font-bold text-blue-600 underline cursor-pointer hover:text-blue-800 uppercase italic">
                          {item.username}
                        </td>
                        <td className="p-3 border-r text-right font-black text-red-600 tracking-tight text-[13px]">
                          Rp {Number(item.nominal || 0).toLocaleString('id-ID')}
                        </td>
                        <td className="p-3 border-r leading-tight font-medium uppercase text-gray-600">
                          <span className="font-bold">{item.bank}</span> - {item.nomor_rekening} <br/>
                          <span className="text-[9px] text-gray-400 font-normal normal-case italic">a.n {item.nama_rekening}</span>
                        </td>
                        <td className="p-3 border-r text-center text-gray-500 text-[10px]">
                          {new Date(item.created_at).toLocaleString('id-ID')}
                        </td>
                        
                        <td className="p-3 border-r text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className={`px-2 py-0.5 rounded-[3px] text-[9px] font-bold text-white uppercase shadow-sm min-w-[65px] ${
                              isSuccess ? 'bg-[#28a745]' : 'bg-[#dc3545]'
                            }`}>
                              {isSuccess ? '✓ Berhasil' : '✕ Ditolak'}
                            </span>
                            
                            {item.processed_at && (
                              <span className="text-[9px] text-gray-400 font-normal italic">
                                {new Date(item.processed_at).toLocaleTimeString('id-ID')}
                              </span>
                            )}
                          </div>
                        </td>

<td className="p-3 text-center bg-gray-50/30 border-l border-gray-100">
  {item.status?.toUpperCase() === 'PENDING' ? (
    <span className="text-gray-300 italic text-[10px]">Menunggu...</span>
  ) : (
    <div className="flex flex-col items-center justify-center">
      <span className="text-zinc-800 font-black text-[10px] uppercase italic leading-tight">
        {/* Mengambil processed_by atau admin_name dari DB */}
        {item.processed_by || item.admin_name || 'ADMIN'}
      </span>
      <span className="text-[8px] text-blue-600 font-bold leading-none mt-1 uppercase tracking-tighter">
        {item.admin_id 
          ? `ID: ${item.admin_id}` 
          : `ID: ${(item.processed_by || item.admin_name || 'ADM').slice(0, 3).toUpperCase()}`
        }
      </span>
    </div>
  )}
</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {/* --- FOOTER PAGINATION --- */}
            <div className="bg-gray-50 px-4 py-3 border-t flex items-center justify-between shadow-inner">
              <div className="text-[11px] text-gray-500 font-medium italic">
                Data <span className="text-blue-600 font-bold">{indexOfFirstItem + 1}</span> - <span className="text-blue-600 font-bold">{Math.min(indexOfLastItem, data.length)}</span> dari <span className="text-gray-800 font-bold">{data.length}</span>
              </div>
              
              <div className="flex gap-1">
                <button 
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded text-[10px] font-bold bg-white disabled:opacity-50"
                >PREV</button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`px-3 py-1 rounded text-[10px] font-bold ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white border'}`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button 
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages || data.length === 0}
                  className="px-3 py-1 border rounded text-[10px] font-bold bg-white disabled:opacity-50"
                >NEXT</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}