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
      {/* Tombol Back Cepat */}
      <button 
        onClick={() => router.push('/admin/member')}
        className="flex items-center gap-1 text-[11px] text-blue-500 mb-2 hover:underline"
      >
        <ArrowLeft size={12}/> Kembali ke Daftar Member
      </button>

      <h1 className="text-[26px] font-normal mb-1">Ubah Member: {username}</h1>
      
      {/* ... LANJUTKAN DENGAN KODE DESIGN FORM BOS DI ATAS ... */}
      {/* (Ganti onClick={() => setView("table")} menjadi onClick={() => router.back()}) */}
      
      <div className="bg-white border rounded shadow-sm overflow-hidden border-gray-300">
         {/* Konten Form Bos yang tadi dimasukkan di sini */}
         <div className="p-6">
            {/* SISI KIRI: FORM DATA */}
            {/* ... kodenya sama seperti yang Bos kirim tadi ... */}
         </div>
      </div>
    </div>
  );
}