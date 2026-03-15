"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import untuk pindah halaman
import { Key, Landmark, Search, RotateCcw } from "lucide-react";

const FilterInput = ({ placeholder, value, onChange, type = "text" }) => (
  <div className="w-full">
    <input 
      type={type}
      placeholder={placeholder} 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-300 rounded px-3 py-2 text-[12px] text-gray-600 focus:outline-none focus:border-blue-400 placeholder:text-gray-400"
    />
  </div>
);

const FilterSelect = ({ label, value, onChange, options = [] }) => (
  <div className="w-full border border-gray-300 rounded px-3 py-1.5 flex flex-col justify-center bg-white">
    <label className="text-[10px] text-gray-400 leading-none">{label}</label>
    <select 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full text-[12px] text-gray-700 focus:outline-none bg-transparent font-medium"
    >
      <option value="">Pilih</option>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
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
  upline: "",
  kodeReferral: "",
  tglDari: "",
  tglSampai: "",
  group: "",
  status: "",
  level: ""
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
  // Kita cek tiap kolom. Kalau filternya kosong, kita anggap lolos (true)
  const matchUsername = filters.username === "" || (m.username || "").toLowerCase().includes(filters.username.toLowerCase());
  const matchNoRek = filters.noRek === "" || (m.nomor_rekening || "").includes(filters.noRek);
  const matchNamaRek = filters.namaRek === "" || (m.nama_rekening || "").toLowerCase().includes(filters.namaRek.toLowerCase());
  const matchNoHp = filters.noHp === "" || (m.nomor_hp || "").includes(filters.noHp);
  const matchUpline = filters.upline === "" || (m.upline || "").toLowerCase().includes(filters.upline.toLowerCase());
  const matchReferral = filters.kodeReferral === "" || (m.kode_referral || "").includes(filters.kodeReferral);
  const matchStatus = filters.status === "" || m.status === filters.status;

  // HANYA tampilkan jika SEMUA kondisi di atas terpenuhi
  return matchUsername && matchNoRek && matchNamaRek && matchNoHp && matchUpline && matchReferral && matchStatus;
});

return (
  <div className="p-6 text-gray-800">
    <h1 className="text-3xl font-normal mb-1">Member</h1>
    <p className="text-xs text-blue-500 mb-6 font-medium">
      Dashboard <span className="text-gray-400 font-normal">/ Member</span>
    </p>
    
    {/* FILTER SECTION */}
<div className="bg-white border rounded shadow-sm overflow-hidden border-gray-200 mb-6">
  <div className="bg-gray-50 px-4 py-2 border-b flex items-center gap-2 text-gray-700 font-semibold text-[13px]">
    <Search size={14} /> Filter
  </div>
  
  <div className="p-4 flex flex-col gap-4">
    {/* BARIS 1 */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <FilterInput placeholder="Username" value={filters.username} onChange={(v) => handleFilterChange("username", v)} />
      <FilterInput placeholder="Nomor Rekening" value={filters.noRek} onChange={(v) => handleFilterChange("noRek", v)} />
      <FilterInput placeholder="Nama Rekening" value={filters.namaRek} onChange={(v) => handleFilterChange("namaRek", v)} />
      <FilterInput placeholder="No Hp" value={filters.noHp} onChange={(v) => handleFilterChange("noHp", v)} />
    </div>

    {/* BARIS 2 */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <FilterInput placeholder="Upline Referral Username" value={filters.upline} onChange={(v) => handleFilterChange("upline", v)} />
      <FilterInput placeholder="Kode Referral" value={filters.kodeReferral} onChange={(v) => handleFilterChange("kodeReferral", v)} />
      <FilterInput type="date" placeholder="Dari Tanggal Register" value={filters.tglDari} onChange={(v) => handleFilterChange("tglDari", v)} />
      <FilterInput type="date" placeholder="Sampai Tanggal Register" value={filters.tglSampai} onChange={(v) => handleFilterChange("tglSampai", v)} />
    </div>

    {/* BARIS 3 */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <FilterSelect label="Member Group" value={filters.group} onChange={(v) => handleFilterChange("group", v)} options={["Reguler", "VIP", "VVIP"]} />
      <FilterSelect label="Status" value={filters.status} onChange={(v) => handleFilterChange("status", v)} options={["Aktif", "Suspend"]} />
      <FilterSelect label="Level" value={filters.level} onChange={(v) => handleFilterChange("level", v)} options={["Bronze", "Silver", "Gold"]} />
      <div className="hidden md:block"></div> {/* Spacer kosong */}
    </div>

    {/* TOMBOL AKSI */}
    <div className="flex gap-2 mt-2">
      <button 
        onClick={handleReset} 
        className="bg-[#00c0ef] text-white px-3 py-1.5 rounded text-[12px] font-bold shadow-sm flex items-center gap-1 hover:brightness-95"
      >
        <RotateCcw size={12} /> Reset
      </button>
      <button 
        onClick={fetchMembers} 
        className="bg-[#007bff] text-white px-3 py-1.5 rounded text-[12px] font-bold shadow-sm flex items-center gap-1 hover:brightness-95"
      >
        <Search size={12} /> Cari
      </button>
    </div>
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
      <td colSpan="9" className="p-10 text-center font-bold text-gray-400 italic">
        <div className="flex items-center justify-center gap-2">
           <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
           SEDANG MENGAMBIL DATA...
        </div>
      </td>
    </tr>
  ) : filteredMembers.length > 0 ? (
    // DISINI KUNCINYA: Pakai filteredMembers, bukan members
    filteredMembers.map((m, index) => (
      <tr key={m.id} className="border-b hover:bg-gray-50 text-black transition-colors">
        <td className="p-2 border-r text-center text-gray-400">{index + 1}.</td>
        
        <td 
          className="p-2 border-r text-blue-600 font-bold cursor-pointer hover:underline"
          onClick={() => router.push(`/admin/member/${m.username}`)}
        >
          {m.username}
        </td>

        {/* 1. Kolom Rekening */}
        <td className="p-2 border-r text-[10px] font-bold uppercase text-center italic text-gray-600">
          {m.nama_bank} - {m.nomor_rekening} - {m.nama_rekening}
        </td>

        {/* 2. Kolom Upline */}
        <td className="p-2 border-r text-center text-[11px]">
          {m.upline || <span className="text-gray-300">-</span>}
        </td>

        {/* 3. Kolom Kode Referral */}
        <td className="p-2 border-r text-center text-[11px] font-mono text-gray-500">
          {m.kode_referral || <span className="text-gray-300">-</span>}
        </td>

        {/* 4. Kolom Status */}
        <td className="p-2 border-r text-center">
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border inline-flex items-center gap-1 ${
            m.status?.toLowerCase() === 'suspend' 
            ? 'bg-red-100 text-red-700 border-red-200' 
            : 'bg-emerald-100 text-emerald-700 border-emerald-200'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${m.status?.toLowerCase() === 'suspend' ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
            {m.status || 'Aktif'}
          </span>
        </td>

        {/* 5. Kolom Saldo */}
        <td className="p-2 border-r text-right font-mono font-bold text-gray-700 bg-gray-50/50">
          {new Intl.NumberFormat('id-ID').format(m.saldo || 0)}
        </td>

        {/* 6. Kolom Total Deposit */}
        <td className="p-2 border-r text-right font-mono font-bold text-blue-600">
          {new Intl.NumberFormat('id-ID').format(m.total_deposit || 0)}
        </td>

        {/* 7. Kolom Action */}
        <td className="p-2 flex gap-1 justify-center">
          <button 
            onClick={() => { setSelectedUser(m); setIsModalOpen(true); }}
            className="bg-[#ffc107] p-1.5 rounded shadow-sm hover:bg-yellow-500 text-white"
            title="Ganti Password"
          >
            <Key size={14} />
          </button>
          <button 
            onClick={() => router.push(`/admin/member/${m.username}`)}
            className="bg-[#28a745] text-white p-1.5 rounded shadow-sm hover:bg-green-600"
            title="Edit Member"
          >
            <Landmark size={14}/>
          </button>
        </td>
      </tr>
    ))
  ) : (
    // JIKA HASIL FILTER KOSONG
    <tr>
      <td colSpan="9" className="p-20 text-center bg-gray-50">
        <div className="flex flex-col items-center justify-center gap-3 text-gray-400">
          <Search size={40} className="text-gray-200" />
          <div className="text-lg font-medium">Member tidak ditemukan</div>
          <p className="text-xs">Coba periksa kembali ejaan atau filter yang Bos masukkan.</p>
          <button 
            onClick={handleReset}
            className="mt-2 text-blue-500 hover:underline font-bold text-xs"
          >
            Bersihkan Semua Filter
          </button>
        </div>
      </td>
    </tr>
  )}
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