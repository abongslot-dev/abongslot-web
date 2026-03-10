// --- BAGIAN ATAS FILE BOS ---
"use client";
import React, { useState, useEffect } from "react";

// Pastikan CheckCircle2 dan XCircle ada di dalam kurung kurawal ini
import { 
  FileBarChart, 
  Search, 
  Check, 
  X, 
  Eye, 
  ArrowRightLeft, 
  CheckCircle2, 
  XCircle 
} from "lucide-react";



// --- Komponen Pembantu Filter untuk Deposit ---
const FilterBox = () => (
  <div className="bg-white rounded shadow-sm border border-gray-200 mb-6">
    <div className="bg-gray-50 px-4 py-2 border-b font-bold text-gray-600 text-sm">▼ Filter</div>
    <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-500 uppercase">Username</label>
        <input type="text" placeholder="Cari username..." className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-500 uppercase">Status</label>
        <select className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Semua Status</option>
          <option value="pending">Pending</option>
          <option value="success">Success</option>
          <option value="cancel">Cancel</option>
        </select>
      </div>
      <div className="flex flex-col gap-1 md:justify-end">
        <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-blue-700">CARI</button>
      </div>
    </div>
  </div>
);

export default function DepositBaruPage({ onUserClick }) {


    const [deposits, setDeposits] = useState([]);
      const [loading, setLoading] = useState(true);
      const [selectedIds, setSelectedIds] = useState([]);
    
      const [currentPage, setCurrentPage] = useState(1);
      const itemsPerPage = 10; // Boss bisa ganti mau berapa data per halaman
    
      // Logika hitung data yang tampil
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      const currentItems = deposits.slice(indexOfFirstItem, indexOfLastItem);
      const totalPages = Math.ceil(deposits.length / itemsPerPage);
    
      const paginate = (pageNumber) => setCurrentPage(pageNumber);
    
      const fetchDepo = async () => {
        try {
          const res = await fetch("/api/admin?target=deposits-pending");
          const data = await res.json();
          // Pastikan format data sesuai API kamu
          setDeposits(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error("Gagal ambil data Depo:", error);
        } finally {
          setLoading(false);
        }
      };
    
      useEffect(() => {
        fetchDepo();
      }, []);
    
// Di dalam file Dashboard Admin Bos
const onAction = async (id, status, amount, user) => {
  // Samakan dengan standar API Bos: 'approve' atau 'reject'
  const actionStatus = status === 'SUCCESS' ? 'approve' : 'reject';
  const label = actionStatus === 'approve' ? 'MENERIMA' : 'MENOLAK';

  if (!confirm(`Yakin ingin ${label} Deposit dari ${user}?`)) return;

  try {
    const res = await fetch('/api/update-depo', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        id: id,            
        status: actionStatus, // Sekarang mengirim 'approve' atau 'reject'
        username: user,
        nominal: amount
      }),
    });

    const result = await res.json();

    if (result.success) {
      alert(`✅ Berhasil di-${actionStatus}!`);
      setDeposits((prev) => prev.filter((item) => item.id !== id));
    } else {
      alert("❌ Gagal: " + result.message);
    }
  } catch (err) {
    alert("❌ Error Server: " + err.message);
  }
};
    
    
    // --- 2. LOGIKA CHECKBOX ---
      const handleSelectAll = (e) => {
        if (e.target.checked) {
          const allIds = deposits.map((item) => item.id);
          setSelectedIds(allIds);
        } else {
          setSelectedIds([]);
        }
      };

      const handleUserClick = (username) => {
    // Pindah ke halaman edit member berdasarkan username
    router.push(`/admin/member/${username}`);
  };
    
      const handleSelectOne = (id) => {
        setSelectedIds((prev) =>
          prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
      };
    
      // --- 3. FUNGSI TERIMA/TOLAK SEMUA ---
      const handleBulkAction = async (status) => {
        const label = status === 'SUCCESS' ? 'TERIMA' : 'TOLAK';
        if (!confirm(`Yakin ingin ${label} ${selectedIds.length} deposit sekaligus?`)) return;
    
        try {
          // Loop untuk eksekusi API satu per satu atau buat API Bulk di backend
          const promises = selectedIds.map(async (id) => {
            const item = deposits.find(d => d.id === id);
            return fetch('/api/update-depo', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: id,
                status: status,
                username: item.username,
                nominal: item.nominal
              }),
            });
          });
    
          await Promise.all(promises);
          alert(`✅ Berhasil ${label} massal!`);
          
          // Update tampilan: hapus data yang sudah diproses
          setDeposits((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
          setSelectedIds([]); // Kosongkan centang kembali
        } catch (err) {
          alert("❌ Gagal Bulk Action: " + err.message);
        }
      };
    
      
  // Masukkan logic fetch deposit & fungsi Approve/Reject di sini
  return (
    <div className="p-6">
      <h1 className="text-3xl font-normal mb-1">Deposit Baru</h1>
      <p className="text-xs text-blue-500 mb-6 font-medium">Dashboard <span className="text-gray-400 font-normal">/ Deposit Baru</span></p>
      <FilterBox />


      
      <div className="bg-white border rounded shadow-sm overflow-hidden mt-6">
        <div className="bg-gray-50 px-4 py-2 border-b flex items-center gap-2 text-[13px] font-bold text-gray-600"><FileBarChart size={16}/> Deposit Baru</div>
        <div className="overflow-x-auto">


          
<table className="w-full text-left text-[11px] border-collapse">
<thead>
  <tr className="border-b bg-white text-[11px] font-bold text-gray-800">
    <th className="p-3 border-r w-8 text-center"><input type="checkbox" /></th>
    <th className="p-2 border-r text-left">No.</th>
    <th className="p-2 border-r text-left">Username</th>
    <th className="p-2 border-r text-left">Promo</th>
    <th className="p-2 border-r text-left">Pembagian Bonus</th>
    <th className="p-2 border-r text-left">Total</th>
    <th className="p-2 border-r text-left">Potongan Admin</th>
    <th className="p-2 border-r text-left">Bonus</th>
    <th className="p-2 border-r text-left">Grand Total</th>
    <th className="p-2 border-r text-left">Nomor Seri</th>
    <th className="p-2 border-r text-left">Dari Bank</th>
    <th className="p-2 border-r text-left">Ke Bank</th>
    <th className="p-2 border-r text-left">Bukti</th>
    <th className="p-2 border-r text-left">Waktu Deposit</th>
    <th className="p-2 text-center">Action</th>
  </tr>
</thead>
            <tbody>
  {deposits.length > 0 ? (
  deposits.map((item, index) => (
    <DepositRow 
      key={item.id}
      item={item} // <--- TAMBAHKAN INI Bossku, agar semua data masuk
      no={index + 1}
      id={item.id}
      user={item.username}
      total={item.nominal}
      bank={item.bank}
      promo={item.promo}
      waktu={item.created_at}
      onAction={onAction}
      onUserClick={() => handleUserClick(item.username)} // <--- Arahkan ke router
      
      
    />
  ))
) : (
    <tr>
      <td colSpan="8" className="p-10 text-center text-gray-400 italic">
        Belum ada deposit baru masuk...
      </td>
    </tr>
  )}
</tbody>
          </table>

          {/* --- FOOTER PAGINATION --- */}
<div className="bg-gray-50 px-4 py-3 border-t flex items-center justify-between shadow-inner">
  <div className="text-[11px] text-gray-500 font-medium italic">
    Menampilkan <span className="text-blue-600 font-bold">{indexOfFirstItem + 1}</span> sampai <span className="text-blue-600 font-bold">{Math.min(indexOfLastItem, deposits.length)}</span> dari <span className="text-gray-800 font-bold">{deposits.length}</span> data
  </div>
  
  <div className="flex gap-1">
    {/* Tombol Back */}
    <button 
      onClick={() => paginate(currentPage - 1)}
      disabled={currentPage === 1}
      className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white border text-gray-700 hover:bg-blue-600 hover:text-white'}`}
    >
      PREV
    </button>

    {/* Nomor Halaman */}
    {[...Array(totalPages)].map((_, i) => (
      <button
        key={i + 1}
        onClick={() => paginate(i + 1)}
        className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-md' : 'bg-white border text-gray-700 hover:bg-blue-100'}`}
      >
        {i + 1}
      </button>
    ))}

    {/* Tombol Next */}
    <button 
      onClick={() => paginate(currentPage + 1)}
      disabled={currentPage === totalPages}
      className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white border text-gray-700 hover:bg-blue-600 hover:text-white'}`}
    >
      NEXT
    </button>
  </div>
</div>
        </div>
      </div>
    </div>
  );
}




// TAMBAHKAN 'item' di dalam kurung kurawal ini Bossku
// 1. Pastikan semua props penting ini ada, terutama item dan onAction
function DepositRow({ item, no, onAction, onUserClick }) {
  
  // 1. Ambil 'nominal' dari item (sesuaikan dengan nama kolom di DB kamu)
  // 2. Kita kasih alias ': total_deposit' supaya kodingan di bawahnya tidak perlu diubah banyak
  const { 
    id, 
    user_id, 
    username, 
    nominal: total_deposit, // Mengambil 'nominal' tapi dinamai 'total_deposit'
    created_at, 
    promo_name 
  } = item;

  const potonganAdmin = 0;
  const bonus = 0;
  
  // Pastikan menggunakan Number() agar tidak terjadi error matematika
  const nominalBersih = Number(total_deposit || item.nominal || item.amount || 0);
  const grandTotal = nominalBersih - potonganAdmin + bonus;

  return (
    <tr className="border-b hover:bg-gray-50 transition-all text-gray-700">
      <td className="p-3 border-r text-center"><input type="checkbox" /></td>
      <td className="p-2 border-r text-center">{no}.</td>
      
      {/* Kolom User */}
      <td 
        className="p-2 border-r text-blue-600 font-bold cursor-pointer hover:underline hover:text-blue-800"
        // Kita panggil onUserClick dengan mengirimkan username saja sesuai rute [username]
        onClick={() => onUserClick(username)} 
      >
        {username}
      </td>

      <td className="p-2 border-r">{promo_name || ""}</td>
      <td className="p-2 border-r"></td>
      <td className="p-2 border-r font-bold text-right">
  {Number(item.nominal || 0).toLocaleString('id-ID')}
</td>

<td className="p-2 border-r text-right">0.00%</td>
<td className="p-2 border-r text-right">0,00</td>

{/* Kolom Grand Total - Sama dengan nominal kalau belum ada bonus */}
<td className="p-2 border-r font-bold text-right">
  {Number(item.nominal || 0).toLocaleString('id-ID')}
</td>
      <td className="p-2 border-r text-center"></td>

      {/* DATA PENGIRIM */}
      <td className="p-2 border-r text-[10px] leading-tight text-black bg-white">
        <div className="font-bold uppercase">
          {item.bank_pengirim} - {item.rek_pengirim}
        </div>
        <div className="text-gray-600 font-medium italic">
          a.n {item.nama_pengirim}
        </div>
      </td>

      {/* DATA TUJUAN */}
      <td className="p-2 border-r text-[10px] leading-tight text-blue-900 bg-blue-50/30">
        <div className="font-bold uppercase text-blue-800">
          {item.bank_tujuan} - {item.rek_tujuan}
        </div>
        <div className="text-gray-700 font-bold italic">
          a.n {item.nama_tujuan}
        </div>
      </td>

      <td className="p-2 border-r text-center"></td>
      <td className="p-2 border-r text-[10px] text-gray-500 whitespace-nowrap">
        {new Date(created_at).toLocaleString('en-GB', { 
          day: '2-digit', month: 'long', year: 'numeric', 
          hour: '2-digit', minute: '2-digit', second: '2-digit' 
        })}
      </td>

        {/* ACTION BUTTONS - SEKARANG PASTI BISA DIKLIK */}
  <td className="p-2 flex gap-1 justify-center">
  <button 
    type="button"
    onClick={(e) => {
      e.stopPropagation(); 
      // GANTI 'APPROVE' JADI 'SUCCESS' BIAR COCOK SAMA FUNGSI ONACTION
      onAction(item.id, 'SUCCESS', item.nominal, item.username); 
    }}
    className="bg-[#007bff] text-white px-2 py-1 rounded flex items-center gap-1 text-[10px] font-bold hover:bg-blue-700 transition-all uppercase cursor-pointer"
  >
    <CheckCircle2 size={12}/> TERIMA
  </button>

  {/* Tombol TOLAK - Pastikan kirim 'REJECT' */}
  <button 
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      onAction(item.id, 'REJECT', item.nominal, item.username); 
    }}
    className="bg-[#dc3545] text-white px-2 py-1 rounded flex items-center gap-1 text-[10px] font-bold hover:bg-red-700 transition-all uppercase cursor-pointer"
  >
    <XCircle size={12}/> TOLAK
  </button>
  </td>
      </tr>
    );
  }