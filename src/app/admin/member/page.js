"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import untuk pindah halaman
import { Key, Landmark, Search, RotateCcw } from "lucide-react";

// --- LETAKKAN DI SINI BOS (DI LUAR FUNCTION) ---
const FilterInput = ({ label, placeholder, value, onChange }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-gray-500 uppercase">{label}</label>
    <input 
      type="text" 
      placeholder={placeholder} 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const FilterSelect = ({ label, value, onChange }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-gray-500 uppercase">{label}</label>
    <select 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Semua Status</option>
      <option value="active">Aktif</option>
      <option value="suspend">Suspend</option>
    </select>
  </div>
);
export default function MemberPage() {
  const router = useRouter(); // Inisialisasi router
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // State untuk Modal Password
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  // --- AMBIL DATA ---
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin?target=members'); 
      const data = await response.json();
      setMembers(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error("Gagal ambil data", error);
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchMembers(); 
  }, []);

  // --- FUNGSI UPDATE PASSWORD ---
  const handleUpdatePassword = async () => {
    if (!newPassword) return alert("Password tidak boleh kosong!");
    // Di sini nanti tambahkan fetch ke API update password
    alert(`Password untuk ${selectedUser.username} berhasil diperbarui!`);
    setNewPassword("");
    setIsModalOpen(false);
  };



// Di dalam function MemberPage()
const [filters, setFilters] = useState({
  username: "",
  noRek: "",
  namaRek: "",
  noHp: "",
  status: ""
});

// 2. Fungsi untuk mengupdate state saat admin mengetik
const handleFilterChange = (name, value) => {
  setFilters(prev => ({ ...prev, [name]: value }));
};

// 3. Fungsi Reset Filter
const handleReset = () => {
  setFilters({ username: "", noRek: "", namaRek: "", noHp: "", status: "" });
  fetchMembers(); // Ambil ulang data fresh dari DB
};

// 4. Logika Penyaringan (Filtering)
// Data ini yang akan Bos gunakan untuk .map() di tabel bawah
const filteredMembers = members.filter((m) => {
  return (
    (m.username || "").toLowerCase().includes(filters.username.toLowerCase()) &&
    (m.rek_nomor || m.nomor_rekening || "").includes(filters.noRek) &&
    (m.rek_nama || m.nama_rekening || "").toLowerCase().includes(filters.namaRek.toLowerCase()) &&
    (m.phone || m.nomor_hp || "").includes(filters.noHp) &&
    (filters.status === "" || m.status === filters.status)
  );
});

return (
  <div className="p-6 text-gray-800">
    <h1 className="text-3xl font-normal mb-1">Member</h1>
    <p className="text-xs text-blue-500 mb-6 font-medium">
      Dashboard <span className="text-gray-400 font-normal">/ Member</span>
    </p>
    
    {/* FILTER SECTION */}
    <div className="bg-[#fcfcfc] border rounded shadow-sm overflow-hidden border-gray-200 mb-6 text-[11px]">
      <div className="bg-gray-100 px-4 py-2 border-b font-bold text-gray-600">▼ Filter</div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <FilterInput 
            label="Username" 
            placeholder="Username" 
            value={filters.username}
            onChange={(val) => handleFilterChange("username", val)}
          />
          <FilterInput 
            label="Nomor Rekening" 
            placeholder="...." 
            value={filters.noRek}
            onChange={(val) => handleFilterChange("noRek", val)}
          />
          <FilterInput 
            label="Nama Rekening" 
            placeholder="...." 
            value={filters.namaRek}
            onChange={(val) => handleFilterChange("namaRek", val)}
          />
          <FilterInput 
            label="Nomor Hp" 
            placeholder="...." 
            value={filters.noHp}
            onChange={(val) => handleFilterChange("noHp", val)}
          />
          <FilterSelect 
            label="Status" 
            value={filters.status}
            onChange={(val) => handleFilterChange("status", val)}
          />
      </div>
      
      <div className="px-4 pb-4 flex gap-1">
        <button 
          onClick={handleReset} 
          className="bg-[#00c0ef] text-white px-3 py-1.5 rounded font-bold shadow-sm flex items-center gap-1 hover:bg-[#0097bc] transition-colors"
        >
          <RotateCcw size={12} /> Reset
        </button>
        <button 
          onClick={fetchMembers} 
          className="bg-[#007bff] text-white px-3 py-1.5 rounded font-bold shadow-sm flex items-center gap-1 hover:bg-[#0069d9] transition-colors"
        >
          <Search size={12} /> Cari
        </button>
      </div>
    </div>

 

      {/* TABEL MEMBER */}
      <div className="bg-white border rounded shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] border-collapse">
    <thead>
  <tr className="border-b bg-gray-50 text-gray-800 font-bold uppercase tracking-tighter text-[11px]">
    <th className="p-2 border-r text-center w-10">No.</th>
    <th className="p-2 border-r text-left">Username</th>
    <th className="p-2 border-r text-center">Rekening</th>
    <th className="p-2 border-r text-center">Upline</th>
    <th className="p-2 border-r text-center">Kode Referral</th>
    <th className="p-2 border-r text-center">Status</th>
    <th className="p-2 border-r text-right">Saldo</th>
    <th className="p-2 border-r text-right">Total Deposit</th>
    <th className="p-2 text-center">Action</th>
  </tr>
</thead>
            <tbody>
  {loading ? (
    <tr>
      {/* Colspan disesuaikan dengan jumlah kolom (9) agar loadingnya full ke kanan */}
      <td colSpan="9" className="p-4 text-center">Loading Data...</td>
    </tr>
  ) : members.map((m, index) => (
    <tr key={m.id} className="border-b hover:bg-gray-50 text-black">
      <td className="p-2 border-r text-center">{index + 1}.</td>
      
      <td 
        className="p-2 border-r text-blue-600 font-bold cursor-pointer hover:underline"
        // NAVIGASI KE HALAMAN EDIT TERPISAH
        onClick={() => router.push(`/admin/member/${m.username}`)}
      >
        {m.username}
      </td>

      {/* 1. Kolom Rekening (Sesuai Gambar) */}
      <td className="p-2 border-r text-[10px] font-bold uppercase text-center italic">
        {m.nama_bank} - {m.nomor_rekening} - {m.nama_rekening}
      </td>

      {/* 2. Kolom Upline (Data Baru) */}
      <td className="p-2 border-r text-center text-[11px]">
        {m.upline || <span className="text-gray-300">-</span>}
      </td>

      {/* 3. Kolom Kode Referral (Data Baru) */}
      <td className="p-2 border-r text-center text-[11px] font-mono text-gray-600">
        {m.kode_referral || <span className="text-gray-300">-</span>}
      </td>

      {/* 4. Kolom Status (Aktif) */}
      <td className="p-2 border-r text-center">
        <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[9px] font-bold border border-emerald-200 inline-flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Aktif
        </span>
      </td>

      {/* 5. Kolom Saldo */}
      <td className="p-2 border-r text-right font-mono font-bold text-gray-700">
        {new Intl.NumberFormat('id-ID').format(m.saldo)}
      </td>

      {/* 6. Kolom Total Deposit (Data Baru - Menyesuaikan Gambar) */}
      <td className="p-2 border-r text-right font-mono font-bold text-blue-600">
        {new Intl.NumberFormat('id-ID').format(m.total_deposit || 0)}
      </td>

      {/* 7. Kolom Action */}
      <td className="p-2 flex gap-1 justify-center">
        <button 
          onClick={() => { setSelectedUser(m); setIsModalOpen(true); }}
          className="bg-[#ffc107] p-1.5 rounded shadow-sm hover:bg-yellow-500"
          title="Ganti Password"
        >
          <Key size={14} />
        </button>
        <button 
          onClick={() => router.push(`/admin/member/${m.username}`)} // Navigasi ke halaman edit
          className="bg-[#28a745] text-white p-1.5 rounded shadow-sm hover:bg-green-600"
          title="Edit Member"
        >
          <Landmark size={14}/>
        </button>
      </td>
    </tr>
  ))}
</tbody>
          </table>
        </div>
      </div>

      {/* MODAL GANTI PASSWORD */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[999]">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden">
            <div className="bg-gray-800 text-white p-4 font-bold flex justify-between uppercase text-xs">
              <span>Ganti Password: {selectedUser?.username}</span>
              <button onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <div className="p-6">
              <label className="text-xs font-bold text-gray-600 uppercase">Password Baru</label>
              <input 
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border-2 border-gray-200 rounded mt-1 p-2 outline-none focus:border-blue-500 text-sm"
                placeholder="Masukkan password baru..."
                autoFocus
              />
              <div className="mt-6 flex gap-2">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-2 bg-gray-100 text-gray-700 font-bold rounded text-[10px]">BATAL</button>
                <button onClick={handleUpdatePassword} className="flex-1 py-2 bg-blue-600 text-white font-bold rounded text-[10px] shadow-lg">SIMPAN</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}