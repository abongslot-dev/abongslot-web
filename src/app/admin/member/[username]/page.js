"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";

export default function EditMemberPage() {
  const params = useParams(); // Mengambil username dari URL
  const router = useRouter();
  const username = params.username; // Ini dapet dari folder [username]

  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState("Member Data");
  const [loading, setLoading] = useState(true);

  // Ambil data user secara spesifik saat halaman dibuka
  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await fetch(`/api/admin?target=members&username=${username}`);
        const data = await response.json();
        // Cari user yang pas di array data
        const user = data.find(u => u.username === username);
        setSelectedUser(user);
        setLoading(false);
      } catch (error) {
        console.error("Gagal load user", error);
        setLoading(false);
      }
    };
    fetchUserDetail();
  }, [username]);

  if (loading) return <div className="p-10 text-center">Sedang mengambil data {username}...</div>;
  if (!selectedUser) return <div className="p-10 text-center">User tidak ditemukan!</div>;

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
                   onClick={() => setView("member")} 
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