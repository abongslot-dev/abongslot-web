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
  const [tabAktif, setTabAktif] = useState("Member Data");

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
              onClick={() => setTabAktif(tab)}
              className={`px-4 py-3 cursor-pointer whitespace-nowrap transition-all border-b-2 ${
                tabAktif === tab 
                  ? "bg-white text-blue-600 border-blue-600" 
                  : "hover:bg-gray-100 border-transparent"
              }`}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* KONTEN DINAMIS BERDASARKAN TAB */}
        <div className="p-6">
          
          {/* 1. TAB MEMBER DATA */}
          {tabAktif === "Member Data" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10">
              {/* SISI KIRI: FORM DATA */}
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Username</label>
                  <input type="text" value={selectedUser?.username || ""} disabled className="w-full border border-gray-300 rounded p-2 bg-[#eceff1] text-[12px] font-medium outline-none" />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Nama Group</label>
                  <select className="w-full border border-gray-300 rounded p-2 text-[12px] outline-none bg-white">
                    <option>Member Baru</option>
                    <option>Regular</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Nama Bank</label>
                    <select className="w-full border border-gray-300 rounded p-2 text-[12px] outline-none bg-white">
                      <option>{selectedUser?.nama_bank || "DANA"}</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Atas Nama</label>
                    <input type="text" defaultValue={selectedUser?.nama_rekening || ""} className="w-full border border-gray-300 rounded p-2 text-[12px] outline-none bg-white" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Nomor Rekening</label>
                    <input type="text" defaultValue={selectedUser?.nomor_rekening || ""} className="w-full border border-gray-300 rounded p-2 text-[12px] outline-none bg-white" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Status</label>
                  <select className="w-full border border-gray-300 rounded p-2 text-[12px] outline-none bg-white font-bold">
                    <option>Aktif</option>
                    <option className="text-red-500">Suspended</option>
                  </select>
                </div>

                <div className="space-y-4">
                  {[
                    { label: "Waktu Register", value: "21 February 2026, 08:24:45" },
                    { label: "Saldo", value: `Rp. ${new Intl.NumberFormat('id-ID').format(selectedUser?.saldo || 0)}` },
                    { label: "Total Deposit", value: "Rp. 0" },
                    { label: "Total Withdrawal", value: "Rp. 0" },
                    { label: "Total TO Sekarang", value: "Rp. 0" },
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

                <div className="flex gap-2 pt-2">
                  <button className="bg-[#007bff] text-white px-4 py-2 rounded text-[12px] font-bold uppercase hover:bg-blue-700 transition-all shadow-sm">Simpan</button>
                  <button onClick={() => router.back()} className="bg-[#ffc107] text-black px-4 py-2 rounded text-[12px] font-bold uppercase hover:bg-yellow-500 transition-all shadow-sm">Kembali</button>
                </div>
              </div>

              {/* SISI KANAN: NOTE AREA */}
              <div className="mt-4 lg:mt-0 flex flex-col">
                <label className="text-[11px] font-normal text-gray-700 block mb-1">Note</label>
                <textarea 
                  className="w-full border border-gray-300 rounded p-3 h-[300px] lg:flex-1 text-[12px] outline-none focus:border-blue-400 shadow-inner resize-none bg-[#fdfdfd]"
                  placeholder="Catatan admin untuk member ini..."
                ></textarea>
              </div>
            </div>
          )}

          {/* 2. TAB DEPOSIT / WITHDRAWAL (Contoh Tabel) */}
          {(tabAktif === "Deposit" ) && (
            <div className="overflow-x-auto border rounded border-gray-200">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="p-2 border-r text-center w-10">No.</th>
                    <th className="p-3 border-r text-right">Total</th>
                    <th className="p-3 border-r text-center">Dari Rekening</th>
                    <th className="p-3 border-r text-center">Ke Rekening</th>
                    <th className="p-2 border-r text-center">Bukti</th>
                    <th className="p-3 border-r text-center">Waktu Deposit</th>
                    <th className="p-2 border-r text-center">Status</th>
                    <th className="p-3 border-r text-center">Admin Respon</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="4" className="p-10 text-center text-gray-400 italic font-mono uppercase">
                      Belum ada data transaksi {tabAktif} ditemukan.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* 2. TAB DEPOSIT / WITHDRAWAL (Contoh Tabel) */}
          {(tabAktif === "Withdrawal") && (
            <div className="overflow-x-auto border rounded border-gray-200">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="p-2 border-r text-center w-10">No.</th>
                    <th className="p-3 border-r text-right">Total</th>
                    <th className="p-3 border-r text-center">Ke Rekening</th>
                    <th className="p-3 border-r text-center">Waktu Withdrawal</th>
                    <th className="p-2 border-r text-center">Status</th>
                    <th className="p-3 border-r text-center">Admin Respon</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="4" className="p-10 text-center text-gray-400 italic font-mono uppercase">
                      Belum ada data transaksi {tabAktif} ditemukan.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* 3. TAB PENYESUAIAN SALDO */}
          {tabAktif === "Penyesuaian Saldo" && (
            <div className="max-w-md bg-[#f8f9fa] border p-6 rounded-lg shadow-inner">
              <h3 className="text-sm font-bold mb-5 border-b pb-2 text-blue-600">MODIFIKASI SALDO MANUAL</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Jumlah Nominal</label>
                  <input type="number" className="w-full border border-gray-300 rounded p-2 text-[14px] font-bold font-mono" placeholder="0" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Jenis Penyesuaian</label>
                  <select className="w-full border border-gray-300 rounded p-2 text-[12px] bg-white">
                    <option>Tambah Saldo (+)</option>
                    <option>Kurangi Saldo (-)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Keterangan</label>
                  <textarea className="w-full border border-gray-300 rounded p-2 text-[12px] h-20" placeholder="Contoh: Bonus Referral, Koreksi Saldo, dll"></textarea>
                </div>
                <button className="w-full bg-emerald-600 text-white py-2.5 rounded text-[12px] font-black uppercase hover:bg-emerald-700 shadow-md">
                  Proses Saldo Sekarang
                </button>
              </div>
            </div>
          )}

          {/* 4. TAB LAINNYA (Placeholder) */}
          {!["Member Data", "Deposit", "Withdrawal", "Penyesuaian Saldo"].includes(tabAktif) && (
            <div className="py-20 text-center bg-gray-50 rounded border border-dashed border-gray-300">
              <div className="text-3xl mb-2 opacity-30">📂</div>
              <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">
                Modul {tabAktif} Sedang Disiapkan
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};