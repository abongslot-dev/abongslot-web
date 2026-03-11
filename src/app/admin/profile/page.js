"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LayoutGrid, Key, Save } from "lucide-react";
import { createClient } from '@supabase/supabase-js';

// PINDAHKAN INI KE LUAR FUNGSI (Paling Atas)
// Supaya tidak dibuat ulang setiap kali komponen render (Penyebab utama Error #321)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ProfilPage() {
  const router = useRouter();
  
  // 1. Definisikan semua State di paling atas
  const [userEmail, setUserEmail] = useState("Memuat...");
  const [userStatus, setUserStatus] = useState("Mengecek...");
  const [fullName, setFullName] = useState(""); 
  const [loading, setLoading] = useState(false);

  // 2. Gunakan useEffect untuk tarik data saat pertama kali buka
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          // Sesuaikan path login Bos, misal /adm/login atau /login
          router.push("/login"); 
          return;
        }

        setUserEmail(user.email || "");
        setFullName(user.user_metadata?.full_name || "Admin");
        setUserStatus(user.aud === "authenticated" ? "Aktif" : "Tidak Aktif");
      } catch (err) {
        console.error("Gagal mengambil data user:", err);
      }
    };

    fetchUser();
  }, [router]);

  // 3. Fungsi Simpan Nama
  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName }
    });

    if (error) {
      alert("Gagal update: " + error.message);
    } else {
      alert("Profil berhasil diperbarui di Database!");
    }
    setLoading(false);
  };

  // 4. Fungsi Ubah Password
  const handleUpdatePassword = async () => {
    const newPass = prompt("Masukkan Password Baru (Min 6 Karakter):");
    if (!newPass) return;

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPass });

    if (error) {
      alert("Gagal: " + error.message);
    } else {
      alert("Password Berhasil Diganti!");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 bg-[#f8f9fa] min-h-screen">
      <div className="flex items-center gap-2 text-gray-500 mb-6">
        <LayoutGrid size={18} />
        <span className="text-sm font-semibold">Profil</span>
      </div>

      <div className="max-w-4xl bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm font-bold text-gray-700">Informasi Akun</h3>
        </div>

        <div className="p-6 space-y-4">
          {/* Input Nama */}
          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">Nama</label>
            <input 
              type="text" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2.5 bg-white border border-gray-300 rounded text-sm focus:border-blue-500 focus:outline-none text-zinc-800"
            />
          </div>

          {/* Input Email */}
          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">Email</label>
            <input 
              type="email" 
              value={userEmail} 
              disabled 
              className="w-full p-2.5 bg-[#eceff1] border border-gray-300 rounded text-sm text-gray-600 cursor-not-allowed font-medium"
            />
          </div>

          {/* Input Status */}
          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">Status</label>
            <input 
              type="text" 
              value={userStatus} 
              disabled 
              className={`w-full p-2.5 bg-[#eceff1] border border-gray-300 rounded text-sm font-bold uppercase ${userStatus === 'Aktif' ? 'text-green-600' : 'text-red-600'}`}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-100">
            <button 
              onClick={handleSave}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded text-[12px] font-bold flex items-center gap-2 transition-all shadow-sm disabled:opacity-50"
            >
              <Save size={14} />
              {loading ? "Menyimpan..." : "Simpan"}
            </button>

            <button 
              onClick={handleUpdatePassword}
              disabled={loading}
              className="bg-[#198754] hover:bg-[#157347] text-white px-5 py-2 rounded text-[12px] font-bold flex items-center gap-2 transition-all shadow-sm disabled:opacity-50"
            >
              <Key size={14} />
              {loading ? "Proses..." : "Ubah Password"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}