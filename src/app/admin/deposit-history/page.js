"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // 1. IMPORT router
import { RotateCcw, Search, FileBarChart } from "lucide-react";

export default function RangkumanDepositPage() {
  const router = useRouter(); // 2. INISIALISASI router di dalam function
  const [data, setData] = useState([]);
  const [totals, setTotals] = useState({ totalNominal: 0, totalBonus: 0, grandTotal: 0 });
  const [loading, setLoading] = useState(true);
  const [currentAdminName, setCurrentAdminName] = useState("");

  // --- LOGIKA PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15; 

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData;
  const totalPages = Math.ceil(data.length / itemsPerPage) || 1;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // 3. FUNGSI NAVIGASI
  const handleUserClick = (username) => {
    if (username) {
      router.push(`/admin/member/${username}`);
    }
  };

const fetchRangkuman = async () => {
    try {
      setLoading(true);
      // Gunakan timestamp agar data selalu fresh (anti-cache)
      const res = await fetch(`/api/update-depo?t=${Date.now()}`); 
      if (!res.ok) throw new Error("Gagal mengambil data");
      const result = await res.json();
      
      const dataAsli = result.data ? result.data : (Array.isArray(result) ? result : []);

      // --- FILTER DATA HARI INI (WIB) ---
      const now = new Date();
      const wibDateString = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });
      const startOfTodayWIB = new Date(`${wibDateString}T00:00:00+07:00`).getTime();

      // Filter data yang hanya dibuat hari ini
      const dataHariIni = dataAsli.filter(item => {
        const itemTime = new Date(item.created_at).getTime();
        return itemTime >= startOfTodayWIB;
      });

      setData(dataHariIni);
      
      let totalNom = 0;
      let totalBns = 0;
      dataHariIni.forEach(curr => {
        let s = curr.status ? String(curr.status).toUpperCase().trim() : "";
        if (['SUCCESS', 'APPROVED', 'SUKSES', 'APPROVE'].includes(s)) {
          totalNom += Number(curr.nominal || 0);
          totalBns += Number(curr.bonus || 0);
        }
      });
      
      setTotals({ 
        totalNominal: totalNom, 
        totalBonus: totalBns, 
        grandTotal: totalNom + totalBns 
      });
    } catch (err) {
      console.error("ERROR RANGKUMAN:", err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  };
// --- LOGIKA AUTO REFRESH TIAP 30 DETIK ---
  useEffect(() => {
    fetchRangkuman(); // Ambil data pertama kali

    const interval = setInterval(() => {
      fetchRangkuman();
    }, 30000); // 30 detik

    return () => clearInterval(interval); // Bersihkan mesin kalau pindah halaman
  }, []);


const [filters, setFilters] = useState({
  username: "",
  keBank: "",
  keNoRek: "",
  keNamaRek: "",
  adminRespon: "",
  tglDari: new Date().toISOString().split('T')[0], // Default tanggal hari ini
  tglSampai: new Date().toISOString().split('T')[0],
  status: "",
  totalDeposit: "",
  urutan: "Tanggal Terbaru",
  munculkan: "15 Data"
});


const handleFilterChange = (name, value) => {
  setFilters(prev => ({ ...prev, [name]: value }));
};

// 2. Fungsi Reset (Ini yang tadi bikin Error Bos!)
const handleReset = () => {
  // Balikin semua ke awal/kosong
  setFilters({
    username: "",
    keBank: "",
    keNoRek: "",
    keNamaRek: "",
    adminRespon: "",
    tglDari: new Date().toISOString().split('T')[0],
    tglSampai: new Date().toISOString().split('T')[0],
    status: "",
    totalDeposit: "",
    urutan: "Tanggal Terbaru",
    munculkan: "15 Data"
  });
  
  // Kalau ada fungsi ambil data, panggil lagi biar tabel refresh
  if (typeof fetchMembers === 'function') fetchMembers();
  if (typeof fetchRangkuman === 'function') fetchRangkuman();
};


const filteredData = data.filter((item) => {
  return (
    (item.username || "").toLowerCase().includes(filters.username.toLowerCase()) &&
    (item.bank_tujuan || "").toLowerCase().includes(filters.keBank.toLowerCase()) &&
    (item.rek_tujuan || "").includes(filters.keNoRek) &&
    (item.nama_tujuan || "").toLowerCase().includes(filters.keNamaRek.toLowerCase()) &&
    (item.status || "").toLowerCase().includes(filters.status.toLowerCase()) &&
    (item.processed_by || "").toLowerCase().includes(filters.adminRespon.toLowerCase())
  );
});

  return (
    <div className="p-6 text-gray-800">
      <h1 className="text-3xl font-normal mb-1 tracking-tight text-black">Rangkuman Deposit</h1>
      <p className="text-[11px] text-blue-500 mb-6 font-medium">
        Dashboard <span className="text-gray-400 font-normal">/ Rangkuman Deposit</span>
      </p>

      {/* --- FILTER AREA --- */}
<div className="bg-white border rounded shadow-sm overflow-hidden border-gray-200 mb-6">
  <div className="bg-gray-50 px-4 py-2 border-b flex items-center gap-2 text-[12px] font-bold text-gray-700">
    <span className="text-gray-400">▼</span> Filter
  </div>
  
  <div className="p-4 flex flex-col gap-4">
    {/* BARIS 1 */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="flex flex-col border rounded px-3 py-1 bg-white focus-within:ring-1 focus-within:ring-blue-400">
        <label className="text-[10px] text-gray-400 uppercase font-bold">Username</label>
        <input 
          type="text" 
          value={filters.username}
          onChange={(e) => handleFilterChange("username", e.target.value)}
          className="w-full text-[12px] outline-none py-1" 
          placeholder="Username" 
        />
      </div>
      <div className="flex flex-col border rounded px-3 py-1 bg-white">
        <label className="text-[10px] text-gray-400 uppercase font-bold">Ke Bank</label>
        <select 
          value={filters.keBank}
          onChange={(e) => handleFilterChange("keBank", e.target.value)}
          className="w-full text-[12px] outline-none py-1 bg-transparent font-medium"
        >
          <option value="">Pilih</option>
          <option value="BCA">BCA</option>
          <option value="BNI">BNI</option>
          <option value="MANDIRI">MANDIRI</option>
        </select>
      </div>
      <div className="flex flex-col border rounded px-3 py-1 bg-white">
        <label className="text-[10px] text-gray-400 uppercase font-bold">Ke Nomor Rekening</label>
        <input 
          type="text" 
          value={filters.keNoRek}
          onChange={(e) => handleFilterChange("keNoRek", e.target.value)}
          className="w-full text-[12px] outline-none py-1" 
          placeholder="Ke Nomor Rekening" 
        />
      </div>
      <div className="flex flex-col border rounded px-3 py-1 bg-white">
        <label className="text-[10px] text-gray-400 uppercase font-bold">Ke Nama Rekening</label>
        <input 
          type="text" 
          value={filters.keNamaRek}
          onChange={(e) => handleFilterChange("keNamaRek", e.target.value)}
          className="w-full text-[12px] outline-none py-1" 
          placeholder="Ke Nama Rekening" 
        />
      </div>
    </div>

    {/* BARIS 2 */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="flex flex-col border rounded px-3 py-1 bg-white">
        <label className="text-[10px] text-gray-400 uppercase font-bold">Admin Respon</label>
        <input 
          type="text" 
          value={filters.adminRespon}
          onChange={(e) => handleFilterChange("adminRespon", e.target.value)}
          className="w-full text-[12px] outline-none py-1" 
          placeholder="Admin Respon" 
        />
      </div>
      <div className="flex flex-col border rounded px-3 py-1 bg-white">
        <label className="text-[10px] text-gray-400 uppercase font-bold">Dari Tanggal Deposit</label>
        <input 
          type="date" 
          value={filters.tglDari}
          onChange={(e) => handleFilterChange("tglDari", e.target.value)}
          className="w-full text-[12px] outline-none py-1" 
        />
      </div>
      <div className="flex flex-col border rounded px-3 py-1 bg-white">
        <label className="text-[10px] text-gray-400 uppercase font-bold">Sampai Tanggal Deposit</label>
        <input 
          type="date" 
          value={filters.tglSampai}
          onChange={(e) => handleFilterChange("tglSampai", e.target.value)}
          className="w-full text-[12px] outline-none py-1" 
        />
      </div>
      <div className="flex flex-col border rounded px-3 py-1 bg-white">
        <label className="text-[10px] text-gray-400 uppercase font-bold">Status</label>
        <select 
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="w-full text-[12px] outline-none py-1 bg-transparent font-medium"
        >
          <option value="">Pilih</option>
          <option value="approve">Approve</option>
          <option value="reject">Reject</option>
          <option value="pending">Pending</option>
        </select>
      </div>
    </div>

    {/* BARIS 3 */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="flex flex-col border rounded px-3 py-1 bg-white">
        <label className="text-[10px] text-gray-400 uppercase font-bold">Total Deposit</label>
        <input 
          type="text" 
          value={filters.totalDeposit}
          onChange={(e) => handleFilterChange("totalDeposit", e.target.value)}
          className="w-full text-[12px] outline-none py-1" 
          placeholder="Total Deposit" 
        />
      </div>
      <div className="flex flex-col border rounded px-3 py-1 bg-white">
        <label className="text-[10px] text-gray-400 uppercase font-bold">Urutan</label>
        <select 
          value={filters.urutan}
          onChange={(e) => handleFilterChange("urutan", e.target.value)}
          className="w-full text-[12px] outline-none py-1 bg-transparent font-medium"
        >
          <option>Tanggal Terbaru</option>
          <option>Tanggal Terlama</option>
          <option>Nominal Terbesar</option>
        </select>
      </div>
      <div className="flex flex-col border rounded px-3 py-1 bg-white">
        <label className="text-[10px] text-gray-400 uppercase font-bold">Munculkan</label>
        <select 
          value={filters.munculkan}
          onChange={(e) => handleFilterChange("munculkan", e.target.value)}
          className="w-full text-[12px] outline-none py-1 bg-transparent font-medium"
        >
          <option>15 Data</option>
          <option>50 Data</option>
          <option>100 Data</option>
        </select>
      </div>
      <div className="hidden md:block"></div>
    </div>

    {/* BUTTONS */}
    <div className="flex gap-1">
      <button 
        onClick={handleReset}
        className="bg-[#00c0ef] text-white px-3 py-1.5 rounded text-[11px] font-bold flex items-center gap-1 hover:brightness-95 shadow-sm"
      >
        <RotateCcw size={12}/> Reset
      </button>
      <button 
        onClick={fetchRangkuman}
        className="bg-[#007bff] text-white px-3 py-1.5 rounded text-[11px] font-bold flex items-center gap-1 hover:brightness-95 shadow-sm"
      >
        <Search size={12}/> Cari
      </button>
    </div>
  </div>
</div>

      {/* --- DATA AREA --- */}
      <div className="bg-white border rounded shadow-sm overflow-hidden border-gray-200">
        <div className="bg-gray-100 px-4 py-2 border-b flex items-center gap-2 text-[12px] font-bold text-gray-600 uppercase">
          <FileBarChart size={14}/> List Rangkuman Deposit
        </div>
        
        <div className="p-4">
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="bg-emerald-50 p-4 rounded border border-emerald-100 min-w-[200px]">
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Total Deposit</p>
              <p className="text-xl font-black text-emerald-700">Rp {Number(totals.totalNominal).toLocaleString('id-ID')}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded border border-blue-100 min-w-[200px]">
              <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Total Bonus</p>
              <p className="text-xl font-black text-blue-700">Rp {Number(totals.totalBonus).toLocaleString('id-ID')}</p>
            </div>
          </div>

          <div className="overflow-x-auto border rounded border-gray-100">
            <table className="w-full text-left text-[11px] border-collapse min-w-[1200px]">
              <thead>
                <tr className="border-b bg-[#f9fafb] text-gray-700 font-bold uppercase">
                  <th className="p-3 border-r text-center w-12">No.</th>
                  <th className="p-3 border-r">Username</th>
                  <th className="p-3 border-r text-right">Nominal</th>
                  <th className="p-3 border-r text-right">Bonus</th>
                  <th className="p-3 border-r text-right">Grand Total</th>
                  <th className="p-3 border-r">Detail Pengirim (User)</th>
                  <th className="p-3 border-r">Detail Penerima (Admin)</th>
                  <th className="p-3 border-r text-center">Waktu Proses</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">Admin Respon</th>
                </tr>
              </thead>
<tbody className="divide-y divide-gray-100">
  {loading ? (
    <tr><td colSpan="10" className="p-10 text-center italic text-gray-400">Memuat data histori...</td></tr>
  ) : filteredData.length === 0 ? ( // Pakai filteredData buat cek kosong atau gak
    <tr><td colSpan="10" className="p-10 text-center text-gray-400 italic">Data yang Bos cari tidak ditemukan.</td></tr>
  ) : (
    filteredData.map((item, i) => { // Pakai data yang sudah difilter
      const statusText = item.status ? String(item.status).toUpperCase().trim() : "PENDING";
      const isTerima = ['SUCCESS', 'APPROVED', 'SUKSES', 'APPROVE', 'TERIMA'].includes(statusText);
      const isTolak = ['REJECT', 'REJECTED', 'TOLAK'].includes(statusText);
      const isPending = !isTerima && !isTolak;

      return (
        <tr key={item.id} className="hover:bg-gray-50/80 transition-colors border-b border-gray-100">
          <td className="p-3 border-r text-center text-gray-400 font-medium">{indexOfFirstItem + i + 1}.</td>
          
          <td 
            className="p-3 border-r font-bold text-blue-600 uppercase italic underline cursor-pointer hover:text-blue-800 transition-all"
            onClick={() => handleUserClick(item.username)}
          >
            {item.username}
          </td>

          <td className="p-3 border-r text-right font-bold text-gray-700">
            {Number(item.nominal || 0).toLocaleString('id-ID')}
          </td>
          <td className="p-3 border-r text-right text-green-600 font-bold">
            {Number(item.bonus || 0).toLocaleString('id-ID')}
          </td>
          <td className="p-3 border-r text-right font-black text-blue-800">
            {Number(item.total_deposit || (Number(item.nominal || 0) + Number(item.bonus || 0))).toLocaleString('id-ID')}
          </td>
          
          <td className="p-3 border-r text-[10px] leading-tight text-gray-600 uppercase">
            <span className="font-bold">{item.bank_pengirim || item.bank || "-"}</span><br/>
            {item.rek_pengirim || item.nomor_rekening || "-"} <br/>
            <span className="italic font-normal normal-case text-gray-400 text-[9px]">a.n {item.nama_pengirim || item.nama_rekening || "-"}</span>
          </td>
          
          <td className="p-3 border-r text-[10px] leading-tight text-blue-900 uppercase">
            <span className="font-bold">{item.bank_tujuan || "BCA"}</span><br/>
            {item.rek_tujuan || "123456789"} <br/>
            <span className="italic font-normal normal-case text-gray-500 text-[9px]">a.n {item.nama_tujuan || "ADMIN"}</span>
          </td>

          <td className="p-3 border-r text-center text-gray-500 text-[10px]">
            {item.processed_at ? new Date(item.processed_at).toLocaleString('id-ID') : (item.created_at ? new Date(item.created_at).toLocaleString('id-ID') : "-")}
          </td>

          <td className="p-3 border-r text-center">
             <span className={`px-2 py-0.5 rounded-[3px] text-[9px] font-bold text-white uppercase shadow-sm inline-block min-w-[65px] ${
               isTerima ? 'bg-[#28a745]' : isTolak ? 'bg-[#dc3545]' : 'bg-[#ffc107] text-black'
             }`}>
               {isTerima ? '✓ Sukses' : isTolak ? '✕ Gagal' : 'PENDING'}
             </span>
          </td>

          {/* KOLOM ADMIN RESPON - LOGIKA CEK NAMA */}
          <td className="p-3 text-center bg-gray-50/30">
            {isPending ? (
              <span className="text-gray-300 italic text-[10px]">Menunggu...</span>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <span className="text-zinc-800 font-black text-[10px] uppercase italic leading-tight">
                  {/* Cek data processed_by dari database, kalau kosong baru tulis Admin */}
                  {item.processed_by || 'ADMIN'}
                </span>
             <span className="text-[8px] text-blue-600 font-bold leading-none mt-1 uppercase tracking-tighter">
        {item.admin_id ? `ID: ${item.admin_id}` : `ID: ${item.processed_by ? item.processed_by.slice(0,3) : 'ADM'}`}
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

            <div className="bg-gray-50 px-4 py-3 border-t flex items-center justify-between">
              <div className="text-[11px] text-gray-500">
                Data <span className="font-bold">{indexOfFirstItem + 1}</span> - <span className="font-bold">{Math.min(indexOfLastItem, data.length)}</span> dari <span className="font-bold">{data.length}</span>
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => paginate(currentPage - 1)} 
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded text-[10px] font-bold bg-white disabled:opacity-50"
                >PREV</button>
                <button 
                  className="px-3 py-1 border rounded text-[10px] font-bold bg-blue-600 text-white"
                >{currentPage}</button>
                <button 
                  onClick={() => paginate(currentPage + 1)} 
                  disabled={currentPage >= totalPages}
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