// app/admin/member/page.js
"use client";
import React, { useState, useEffect } from "react"; // Tambahkan useEffect di sini!
// Import tabel, filter, dll


const FilterInput = ({ label, placeholder }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-gray-500 uppercase">{label}</label>
    <input 
      type="text" 
      placeholder={placeholder} 
      className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const FilterSelect = ({ label }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-gray-500 uppercase">{label}</label>
    <select className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
      <option value="">Semua Status</option>
      <option value="active">Aktif</option>
      <option value="suspend">Suspend</option>
    </select>
  </div>
);

export default function MemberPage({ initialUser, clearInitialUser }) {
  // Masukkan semua logic Fetch Member & Modal Edit di sini
  const [view, setView] = useState("table"); 
   const [selectedUser, setSelectedUser] = useState(null);
   const [members, setMembers] = useState([]);
   const [loading, setLoading] = useState(true);
   const [activeTab, setActiveTab] = useState("Member Data"); // <--- INI BIAR GAK ERROR PAS KLIK USER
 
   // State untuk Modal Password
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [newPassword, setNewPassword] = useState("");
 
   // --- FUNGSI UPDATE PASSWORD ---
   const handleUpdatePassword = async () => {
     if (!newPassword) return alert("Password tidak boleh kosong!");
     alert("Password berhasil diperbarui!");
     setNewPassword("");
     setIsModalOpen(false);
   };
 
  // ✅ BENAR: Gunakan Dependency Array
useEffect(() => {
  if (initialUser) {
    setSelectedUser(initialUser);
    setView("edit");
  }
}, [initialUser]); // <--- Tambahkan ini! Kode hanya jalan kalau initialUser berubah.
 
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
 
   useEffect(() => { fetchMembers(); }, []);
 
   // --- 1. PASTIKAN STATE INI ADA DI PALING ATAS FUNGSI MEMBERPAGE ---
   // const [activeTab, setActiveTab] = useState("Member Data");
 
   if (view === "edit" && selectedUser) {
     return (
       <div className="p-6 text-gray-800 bg-[#f4f6f9] min-h-screen font-sans">
         {/* Breadcrumb & Judul */}
         <h1 className="text-[26px] font-normal mb-1">Ubah Member</h1>
         <div className="text-[11px] text-blue-500 mb-6 font-medium flex gap-1">
           Dashboard / Member / <span className="text-gray-400 font-normal">Ubah Member</span>
         </div>
 
         <div className="bg-white border rounded shadow-sm overflow-hidden border-gray-300">
           {/* Header Panel */}
           <div className="bg-gray-50 px-4 py-2 border-b font-bold text-gray-600 text-[13px] flex items-center gap-2">
             <span className="text-sm">田</span> Ubah Member
           </div>
 
           {/* Tab Menu - Persis Gambar */}
           <div className="flex bg-gray-50 border-b text-[11px] font-bold uppercase text-gray-500 overflow-x-auto">
             {["Member Data", "Deposit", "Deposit Auto", "Withdrawal", "Penyesuaian Saldo", "Laporan Transaksi", "Laporan Permainan", "Referral"].map((tab) => (
               <div
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={`p-3 px-5 border-r border-gray-200 cursor-pointer transition-all whitespace-nowrap ${
                   activeTab === tab
                     ? "bg-white text-blue-600 border-t-2 border-t-blue-500"
                     : "hover:bg-gray-100"
                 }`}
               >
                 {tab}
               </div>
             ))}
           </div>
 
           {/* Konten Utama: Kiri (Form) & Kanan (Note) */}
           <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-x-10">
             {/* SISI KIRI: FORM DATA */}
             <div className="space-y-4">
               {/* Username - Abu-abu */}
               <div>
                 <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Username</label>
                 <input type="text" value={selectedUser?.username || ""} disabled className="w-full border border-gray-300 rounded p-2 bg-[#eceff1] text-[12px] font-medium outline-none" />
               </div>
 
               {/* Group - Dropdown */}
               <div>
                 <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Nama Group</label>
                 <select className="w-full border border-gray-300 rounded p-2 text-[12px] outline-none bg-white">
                   <option>Member Baru</option>
                   <option>Regular</option>
                 </select>
               </div>
 
               {/* Baris Bank - Rekening */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                 <div>
                   <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Nama Bank</label>
                   <select className="w-full border border-gray-300 rounded p-2 text-[12px] outline-none bg-white">
                     <option>{selectedUser?.nama_bank || "DANA"}</option>
                   </select>
                 </div>
                 <div className="md:col-span-1">
                   <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Atas Nama</label>
                   <input type="text" defaultValue={selectedUser?.nama_rekening || ""} className="w-full border border-gray-300 rounded p-2 text-[12px] outline-none bg-white" />
                 </div>
                 <div className="md:col-span-1">
                   <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Nomor Rekening</label>
                   <input type="text" defaultValue={selectedUser?.nomor_rekening || ""} className="w-full border border-gray-300 rounded p-2 text-[12px] outline-none bg-white" />
                 </div>
               </div>
 
               {/* Status - Dropdown */}
               <div>
                 <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Status</label>
                 <select className="w-full border border-gray-300 rounded p-2 text-[12px] outline-none bg-white font-bold">
                   <option>Aktif</option>
                   <option className="text-red-500">Suspended</option>
                 </select>
               </div>
 
               {/* Info Detail - Background Abu-abu panjang persis gambar */}
               <div className="space-y-4">
                 {[
                   { label: "Waktu Register", value: "21 February 2026, 08:24:45" },
                   { label: "Saldo", value: `Rp. ${new Intl.NumberFormat('id-ID').format(selectedUser?.saldo || 0)}` },
                   { label: "Total Deposit", value: "Rp. 0" },
                   { label: "Total Withdrawal", value: "Rp. 0" },
                   { label: "Total TO Sekarang Saat Deposit Pengambilan Promo", value: "Rp. 0" },
                   { label: "IP", value: "2400:9800:680:2a7e:1" },
                 ].map((item, idx) => (
                   <div key={idx}>
                     <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">{item.label}</label>
                     <div className="p-2 bg-[#eceff1] border border-gray-300 rounded text-[12px] font-bold text-gray-800">
                       {item.value}
                     </div>
                   </div>
                 ))}
               </div>
 
               {/* Tombol Aksi */}
               <div className="flex gap-2 pt-2">
                 <button className="bg-[#007bff] text-white px-4 py-2 rounded text-[12px] font-bold shadow-sm uppercase hover:bg-blue-700 transition-all">Simpan</button>
                 <button 
                   onClick={() => setView("table")} 
                   className="bg-[#ffc107] text-black px-4 py-2 rounded text-[12px] font-bold shadow-sm uppercase hover:bg-yellow-500 transition-all"
                 >
                   Kembali
                 </button>
               </div>
             </div>
 
             {/* SISI KANAN: NOTE AREA */}
             <div className="mt-4 lg:mt-0">
               <label className="text-[11px] font-normal text-gray-700 block mb-1">Note</label>
               <textarea 
                 className="w-full border border-gray-300 rounded p-3 h-[300px] lg:h-[400px] text-[12px] outline-none focus:border-blue-400 shadow-inner resize-none"
                 placeholder=""
               ></textarea>
             </div>
           </div>
         </div>
       </div>
     );
   }
 
   // --- 4. TAMPILAN DEFAULT (TABEL MEMBER) ---
   return (
     <div className="p-6 text-gray-800">
       <h1 className="text-3xl font-normal mb-1">Member</h1>
       <p className="text-xs text-blue-500 mb-6 font-medium">Dashboard <span className="text-gray-400 font-normal">/ Member</span></p>
       
       {/* FILTER (Sama seperti kodemu sebelumnya) */}
       <div className="bg-[#fcfcfc] border rounded shadow-sm overflow-hidden border-gray-200 mb-6 text-[11px]">
         <div className="bg-gray-100 px-4 py-2 border-b font-bold text-gray-600">▼ Filter</div>
         <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <FilterInput label="Username" placeholder="Username" />
            <FilterInput label="Nomor Rekening" placeholder="...." />
            <FilterInput label="Nama Rekening" placeholder="...." />
            <FilterInput label="Nomor Hp" placeholder="...." />
            <FilterInput label="Upline" placeholder="...." />
            <FilterInput label="Kode Ref" placeholder="...." />

            
            <FilterSelect label="Status" />
            {/* ... tambahkan filter lainnya ... */}
         </div>
         <div className="px-4 pb-4 flex gap-1">
           <button className="bg-[#00c0ef] text-white px-3 py-1.5 rounded font-bold shadow-sm">Reset</button>
           <button className="bg-[#007bff] text-white px-3 py-1.5 rounded font-bold shadow-sm">Cari</button>
         </div>
       </div>
 
       {/* TABEL */}
       <div className="bg-white border rounded shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
           <table className="w-full text-left text-[11px] border-collapse">
 <thead>
   <tr className="border-b bg-gray-50 text-gray-800 font-bold uppercase tracking-tighter text-[11px]">
     <th className="p-2 border-r text-center w-10">No.</th>
     <th className="p-2 border-r">Username</th>
     <th className="p-2 border-r text-center"> Rekening</th>
     <th className="p-2 border-r text-right">Saldo</th>
     <th className="p-2 border-r text-center">Status</th>
     <th className="p-2 text-center text-center">Action</th>
   </tr>
 </thead>
          <tbody>
   {loading ? (
     <tr><td colSpan="6" className="p-4 text-center">Loading Data...</td></tr>
   ) : members.map((m, index) => (
     <tr key={m.id} className="border-b hover:bg-gray-50 text-black">
       {/* 1. Nomor */}
       <td className="p-2 border-r text-center">{index + 1}.</td>
       
       {/* 2. Username */}
       <td 
         className="p-2 border-r text-blue-600 font-bold cursor-pointer hover:underline"
         onClick={() => {
             setSelectedUser(m);
             setView("edit");
         }}
       >
         {m.username}
       </td>
 
       {/* 3. Kolom Gabungan: BANK - NOREK - NAMA (GABUNG DISINI) */}
       <td className="p-2 border-r text-[10px] font-bold uppercase">
         <div className="flex gap-1.5 items-center">
           <span className="text-blue-700">{m.nama_bank || "-"}</span>
           <span className="text-gray-400">-</span>
           <span className="font-mono tracking-tighter">{m.nomor_rekening || "-"}</span>
           <span className="text-gray-400">-</span>
           <span className="text-gray-600 italic">{m.nama_rekening || "-"}</span>
         </div>
       </td>
 
       {/* 4. Kolom Saldo */}
       <td className="p-2 border-r text-right font-mono font-bold text-emerald-600">
         {new Intl.NumberFormat('id-ID').format(m.saldo)}
       </td>
 
       {/* 5. Kolom Status */}
       <td className="p-2 border-r text-center">
         <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[9px] font-bold border border-emerald-200">
           Aktif
         </span>
       </td>
 
       {/* 6. Kolom Action */}
       <td className="p-2 flex gap-1 justify-center">
         <button 
           onClick={() => { setSelectedUser(m); setIsModalOpen(true); }}
           className="bg-[#ffc107] p-1.5 rounded shadow-sm"
           title="Ganti Password"
         >
           <Key size={14} />
         </button>
         <button className="bg-[#28a745] text-white p-1.5 rounded shadow-sm">
           <Landmark size={14}/>
         </button>
       </td>
     </tr>
   ))}
 </tbody>
           </table>
         </div>
       </div>
 
 {/* --- MODAL HARUS DI DALAM SINI (Sebelum penutup div utama MemberPage) --- */}
       {isModalOpen && (
         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[999]">
           <div className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden">
             <div className="bg-gray-800 text-white p-4 font-bold flex justify-between">
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
                 <button 
                   onClick={() => setIsModalOpen(false)}
                   className="flex-1 py-2 bg-gray-100 text-gray-700 font-bold rounded text-xs"
                 >
                   BATAL
                 </button>
                 <button 
                   onClick={handleUpdatePassword}
                   className="flex-1 py-2 bg-blue-600 text-white font-bold rounded text-xs shadow-lg hover:bg-blue-700"
                 >
                   SIMPAN
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}
     </div>
   );
 }
 