"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Database, History, Wallet, User as UserIcon } from "lucide-react";
import { createClient } from '@supabase/supabase-js';

// Inisialisasi langsung di sini agar proses Build tidak bingung mencari file
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function EditMemberPage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username;

  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabAktif, setTabAktif] = useState("Member Data");
  const [dataDeposit, setDataDeposit] = useState([]);

  // 1. Ambil Detail User
  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await fetch(`/api/admin?target=members&username=${username}`);
        const data = await response.json();
        const user = data.find((u) => u.username === username);
        setSelectedUser(user);
        setLoading(false);
      } catch (error) {
        console.error("Gagal load user", error);
        setLoading(false);
      }
    };
    fetchUserDetail();
  }, [username]);

  // 2. Ambil Data Deposit Khusus User Ini
  useEffect(() => {
    if (tabAktif === "Deposit" && selectedUser) {
      const getDeposits = async () => {
        // Asumsi Bos menggunakan Supabase Client yang sudah di-import
        // Jika pakai API, ganti bagian ini dengan fetch ke API deposits Bos
        const { data, error } = await supabase
          .from("deposits")
          .select("*")
          .eq("username", selectedUser.username)
          .order("created_at", { ascending: false });

        if (data) setDataDeposit(data);
      };
      getDeposits();
    }
  }, [tabAktif, selectedUser]);

  if (loading) return <div className="p-10 text-center text-[12px] font-bold">LOADING DATA...</div>;
  if (!selectedUser) return <div className="p-10 text-center">User tidak ditemukan!</div>;

  // Logika Terima Deposit (Contoh)
  const handleTerimaDepo = async (depo) => {
    const confirm = window.confirm(`Terima Deposit Rp ${new Intl.NumberFormat('id-ID').format(depo.nominal)}?`);
    if (confirm) {
      alert("Logic: Update status depo ke 'terima', tambah saldo member, dan catat ke transactions.");
      // Di sini Bos panggil fungsi update ke database
    }
  };




 // Menghitung otomatis total deposit yang sukses
const totalDepo = dataDeposit
  ? dataDeposit
      .filter(d => d.status?.toLowerCase() === 'approve' || d.status?.toLowerCase() === 'terima')
      .reduce((sum, item) => sum + Number(item.nominal || 0), 0)
  : 0;

// Menghitung otomatis total withdrawal yang sukses
const totalWD = dataWD
  ? dataWD
      .filter(w => w.status?.toLowerCase() === 'approve' || w.status?.toLowerCase() === 'terima')
      .reduce((sum, item) => sum + Number(item.nominal || 0), 0)
  : 0;

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
<div className="space-y-4 mt-4">
  {[
    { 
      label: "Waktu Register", 
      value: selectedUser?.created_at 
        ? new Date(selectedUser.created_at).toLocaleString('id-ID', { 
            day: 'numeric', month: 'long', year: 'numeric', 
            hour: '2-digit', minute: '2-digit', second: '2-digit' 
          }) 
        : "-" 
    },
    { 
      label: "Saldo", 
      value: `Rp. ${new Intl.NumberFormat('id-ID').format(selectedUser?.saldo || 0)}` 
    },
    { 
      label: "Total Deposit", 
      // SEKARANG SUDAH SINKRON DENGAN VARIABEL DI ATAS
      value: `Rp. ${new Intl.NumberFormat('id-ID').format(totalDepo)}` 
    },
    { 
      label: "Total Withdrawal", 
      // SEKARANG SUDAH SINKRON DENGAN VARIABEL DI ATAS
      value: `Rp. ${new Intl.NumberFormat('id-ID').format(totalWD)}` 
    },
    { 
      label: "Total TO Sekarang", 
      value: `Rp. ${new Intl.NumberFormat('id-ID').format(selectedUser?.total_to || 0)}` 
    },
    { 
      label: "IP", 
      value: selectedUser?.last_ip || "0.0.0.0" 
    },
  ].map((item, idx) => (
    <div key={idx}>
      <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
        {item.label}
      </label>
      <div className="p-2 bg-[#eceff1] border border-gray-300 rounded text-[12px] font-bold text-gray-800 shadow-sm">
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







       
{(tabAktif === "Deposit") && (
  <div className="space-y-4">
    <div className="overflow-x-auto border rounded border-gray-200 shadow-sm bg-white">
      <table className="w-full text-left text-[11px] border-collapse">
        <thead className="bg-gray-50 border-b text-gray-700 font-bold uppercase">
          <tr>
            <th className="p-2 border-r text-center w-10">No.</th>
            <th className="p-3 border-r text-right">Total</th>
            <th className="p-3 border-r text-center">Dari Rekening</th>
            <th className="p-3 border-r text-center">Ke Rekening</th>
            <th className="p-2 border-r text-center">Bukti</th>
            <th className="p-3 border-r text-center">Waktu Deposit</th>
            <th className="p-2 border-r text-center">Status</th>
            <th className="p-3 text-center">Admin Respon</th>
          </tr>
        </thead>
        <tbody>
          {dataDeposit && dataDeposit.length > 0 ? (
            dataDeposit.map((depo, index) => (
              <tr key={depo.id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="p-2 border-r text-center text-gray-400">{index + 1}</td>
                {/* Kolom Total (Nominal) */}
                <td className="p-3 border-r text-right font-bold text-emerald-600">
                  {new Intl.NumberFormat('id-ID').format(depo.nominal)}
                </td>
                {/* Kolom Dari Rekening (Pengirim) */}
                <td className="p-3 border-r text-center">
                  <div className="font-bold uppercase text-blue-600">{depo.bank_pengirim}</div>
                  <div className="text-[13px] text-gray-500">{depo.rek_pengirim}</div>
                  <div className="text-[13px] text-gray-400 italic">a.n {depo.nama_pengirim}</div>
                </td>
                {/* Kolom Ke Rekening (Tujuan) */}
                <td className="p-3 border-r text-center">
                  <div className="font-bold">{depo.bank_tujuan}</div>
                  <div className="text-[13px] text-orange-600 font-bold italic uppercase">a.n {depo.nama_tujuan}</div>
                  <div className="text-[13px] text-gray-500">{depo.rek_tujuan}</div>
                </td>
                {/* Kolom Bukti */}
                <td className="p-2 border-r text-center">
                  <button className="text-blue-500 hover:text-blue-700 underline text-[10px]">Lihat</button>
                </td>
                {/* Kolom Waktu */}
                <td className="p-3 border-r text-center text-gray-500 italic">
                  {new Date(depo.created_at).toLocaleString('id-ID')}
                </td>
                {/* Kolom Status */}
<td className="p-2 border-r text-center font-black">
  {/* Kondisi PENDING */}
  {depo.status?.toLowerCase() === 'pending' && (
    <span className="text-orange-500 bg-orange-50 px-2 py-1 rounded border border-orange-200">PENDING</span>
  )}

  {/* Kondisi SUKSES (Sesuaikan dengan 'approve' dari database Bos) */}
  {(depo.status?.toLowerCase() === 'terima' || depo.status?.toLowerCase() === 'approve') && (
    <span className="text-emerald-500 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 uppercase font-bold">Selesai</span>
  )}

  {/* Kondisi TOLAK */}
  {(depo.status?.toLowerCase() === 'tolak' || depo.status?.toLowerCase() === 'reject') && (
    <span className="text-red-500 bg-red-50 px-2 py-1 rounded border border-red-200 uppercase font-bold">Ditolak</span>
  )}
</td>
                {/* Kolom Admin Respon */}
                <td className="p-3 text-center text-[10px] text-gray-400 italic font-medium uppercase">
                  {depo.status === 'pending' ? '-' : 'System / Admin'}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="p-10 text-center text-gray-400 italic font-mono uppercase">
                Belum ada data transaksi {tabAktif} ditemukan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    
    {/* Footer Info Tambahan */}
    <div className="bg-white p-2 text-right text-[10px] text-gray-400 border border-t-0 rounded-b italic">
      Menampilkan riwayat deposit terakhir untuk member: <span className="font-bold">{selectedUser.username}</span>
    </div>
  

   <button 
               
      onClick={() => router.back()}
      className="bg-[#f39c12] hover:bg-[#e67e22] text-white px-4 py-1.5 rounded text-[12px] font-bold shadow-sm transition-all mt-4"
    >
      Kembali
    </button>
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





         {tabAktif === "Penyesuaian Saldo" && (
  <div className="space-y-6">
    {/* BAGIAN ATAS: INPUT FORM HORIZONTAL */}
    <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end bg-white">
      {/* Saldo Saat Ini (Read Only) */}
      <div className="md:col-span-1">
        <label className="text-[11px] text-gray-600 block mb-1">Saldo</label>
        <div className="p-2 bg-[#eceff1] border border-gray-300 rounded text-[13px] font-bold">
          Rp. {new Intl.NumberFormat('id-ID').format(selectedUser?.saldo || 0)}
        </div>
      </div>

      {/* Username (Read Only) */}
      <div className="md:col-span-1">
        <label className="text-[11px] text-gray-600 block mb-1">Username</label>
        <div className="p-2 bg-[#eceff1] border border-gray-300 rounded text-[13px]">
          {selectedUser?.username}
        </div>
      </div>

      {/* Dropdown Tipe */}
      <div className="md:col-span-1">
        <label className="text-[11px] text-gray-600 block mb-1">Tipe</label>
        <select className="w-full border border-gray-300 rounded p-2 text-[12px] bg-white outline-none focus:border-blue-500">
          <option>Pilih Tipe</option>
          <option>Tambah Saldo (+)</option>
          <option>Kurangi Saldo (-)</option>
        </select>
      </div>

      {/* Dropdown Kategori */}
      <div className="md:col-span-1">
        <label className="text-[11px] text-gray-600 block mb-1">Kategori</label>
        <select className="w-full border border-gray-300 rounded p-2 text-[12px] bg-white outline-none focus:border-blue-500">
          <option>Penyesuaian Saldo</option>
          <option>Bonus</option>
          <option>Koreksi Sistem</option>
        </select>
      </div>

      {/* Input Jumlah */}
      <div className="md:col-span-1">
        <label className="text-[11px] text-gray-600 block mb-1">Jumlah</label>
        <input type="number" className="w-full border border-gray-300 rounded p-2 text-[12px] outline-none focus:border-blue-500" defaultValue="0" />
      </div>

      {/* Input Keterangan */}
      <div className="md:col-span-1">
        <label className="text-[11px] text-gray-600 block mb-1">Keterangan</label>
        <input type="text" className="w-full border border-gray-300 rounded p-2 text-[12px] outline-none focus:border-blue-500" placeholder="..." />
      </div>
    </div>

    {/* Tombol Tambah */}
    <div className="mt-2">
      <button className="bg-[#00a65a] hover:bg-[#008d4c] text-white px-4 py-1.5 rounded text-[12px] font-bold flex items-center gap-1 transition-all shadow-sm">
        <span className="text-lg">+</span> Tambah
      </button>
    </div>

    {/* BAGIAN BAWAH: TABEL RIWAYAT ADJUSTMENT */}
    <div className="mt-6 border border-gray-200 rounded overflow-hidden">
      <table className="w-full text-left text-[11px] border-collapse">
        <thead>
          <tr className="bg-white border-b text-gray-800 font-bold">
            <th className="p-2 border-r w-10">No.</th>
            <th className="p-2 border-r">Tipe</th>
            <th className="p-2 border-r">Info</th>
            <th className="p-2 border-r">Total</th>
            <th className="p-2 border-r">Admin</th>
            <th className="p-2">Waktu Adjustment</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b bg-white text-center">
            <td colSpan="6" className="p-4 text-gray-500 italic">Tidak ada data</td>
          </tr>
        </tbody>
      </table>
      {/* Footer Info Tabel */}
      <div className="bg-white p-2 text-right text-[11px] text-gray-600 border-t">
        Menampilkan sampai dari total 0 baris
      </div>
    </div>

    {/* Tombol Kembali (Kuning) */}
    <button 
      onClick={() => router.back()}
      className="bg-[#f39c12] hover:bg-[#e67e22] text-white px-4 py-1.5 rounded text-[12px] font-bold shadow-sm transition-all mt-4"
    >
      Kembali
    </button>
  </div>
)}





{tabAktif === "Laporan Transaksi" && (
  <div className="space-y-4">
    {/* FILTER JUMLAH DATA */}
    <div className="max-w-[150px]">
      <label className="text-[10px] text-gray-500 block mb-1">Munculkan</label>
      <select className="w-full border border-gray-300 rounded p-1.5 text-[12px] bg-white outline-none focus:border-blue-500 shadow-sm">
        <option>15 Data</option>
        <option>25 Data</option>
        <option>50 Data</option>
        <option>Semua</option>
      </select>
    </div>

    {/* TABEL LAPORAN TRANSAKSI */}
    <div className="border border-gray-200 rounded overflow-hidden shadow-sm bg-white">
      <table className="w-full text-left text-[11px] border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b text-gray-800 font-bold uppercase tracking-tight">
            <th className="p-2.5 border-r w-[40%]">Info</th>
            <th className="p-2.5 border-r text-right w-[15%]">Debit</th>
            <th className="p-2.5 border-r text-right w-[15%]">Credit</th>
            <th className="p-2.5 border-r text-right w-[15%]">Saldo</th>
            <th className="p-2.5 text-left w-[15%]">Tanggal</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {/* Contoh Baris 1: Deposit Berhasil */}
          <tr className="border-b hover:bg-gray-50 transition-colors">
            <td className="p-2.5 border-r font-medium">Deposit Berhasil</td>
            <td className="p-2.5 border-r text-right text-emerald-600 font-bold">50.000</td>
            <td className="p-2.5 border-r text-right text-gray-400">0</td>
            <td className="p-2.5 border-r text-right font-bold text-blue-600">50.000</td>
            <td className="p-2.5 text-[10px] text-gray-500 italic">11 March 2026, 06:05:51</td>
          </tr>
          
          {/* Contoh Baris 2: Permintaan Deposit */}
          <tr className="border-b hover:bg-gray-50 transition-colors bg-gray-50/30">
            <td className="p-2.5 border-r font-medium text-gray-500">Permintaan Deposit</td>
            <td className="p-2.5 border-r text-right text-emerald-600 font-bold">50.000</td>
            <td className="p-2.5 border-r text-right text-gray-400">0</td>
            <td className="p-2.5 border-r text-right font-bold text-gray-400">0</td>
            <td className="p-2.5 text-[10px] text-gray-500 italic">11 March 2026, 06:05:01</td>
          </tr>

          {/* Jika data kosong, aktifkan ini:
          <tr>
            <td colSpan="5" className="p-10 text-center text-gray-400 italic bg-white">
              Tidak ada data transaksi ditemukan dalam periode ini.
            </td>
          </tr> 
          */}
        </tbody>
      </table>

      {/* FOOTER TABEL (Pagination Info) */}
      <div className="bg-white p-2.5 text-right text-[11px] text-gray-600 border-t font-medium">
        Menampilkan 1 sampai 2 dari total 2 baris
      </div>
    </div>

    {/* TOMBOL KEMBALI */}
    <div className="pt-2">
      <button 
        onClick={() => router.back()}
        className="bg-[#f39c12] hover:bg-[#e67e22] text-white px-4 py-1.5 rounded text-[12px] font-bold shadow-sm transition-all"
      >
        Kembali
      </button>
    </div>
  </div>
)}



{tabAktif === "Laporan Permainan" && (
  <div className="space-y-6">
    {/* BARIS 1: FILTER TANGGAL & DROPDOWN */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <label className="text-[11px] text-gray-600 block mb-1">Dari Tanggal</label>
        <div className="relative">
          <input type="date" className="w-full border border-gray-300 rounded p-2 text-[12px] outline-none" defaultValue="2026-03-11" />
        </div>
      </div>
      <div>
        <label className="text-[11px] text-gray-600 block mb-1">Sampai Tanggal</label>
        <div className="relative">
          <input type="date" className="w-full border border-gray-300 rounded p-2 text-[12px] outline-none" defaultValue="2026-03-11" />
        </div>
      </div>
      <div>
        <label className="text-[11px] text-gray-600 block mb-1">Permainan</label>
        <select className="w-full border border-gray-300 rounded p-2 text-[12px] bg-white outline-none">
          <option>Pilih</option>
          <option>Togel</option>
          <option>Slot</option>
          <option>Live Casino</option>
        </select>
      </div>
      <div>
        <label className="text-[11px] text-gray-600 block mb-1">Provider</label>
        <select className="w-full border border-gray-300 rounded p-2 text-[12px] bg-white outline-none">
          <option>Pilih</option>
          <option>Pragmatic Play</option>
          <option>PG Soft</option>
          <option>Habanero</option>
        </select>
      </div>
    </div>

    {/* BARIS 2: INPUT ID & LIMIT */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <label className="text-[11px] text-gray-600 block mb-1">Transaksi ID</label>
        <input type="text" className="w-full border border-gray-300 rounded p-2 text-[12px] outline-none" placeholder="" />
      </div>
      <div>
        <label className="text-[11px] text-gray-600 block mb-1">Round ID</label>
        <input type="text" className="w-full border border-gray-300 rounded p-2 text-[12px] outline-none" placeholder="" />
      </div>
      <div>
        <label className="text-[11px] text-gray-600 block mb-1">Munculkan</label>
        <select className="w-full border border-gray-300 rounded p-2 text-[12px] bg-white outline-none">
          <option>15 Data</option>
          <option>50 Data</option>
          <option>100 Data</option>
        </select>
      </div>
    </div>

    {/* TOMBOL AKSI */}
    <div className="flex gap-2">
      <button className="bg-[#00c0ef] hover:bg-[#00a7d0] text-white px-4 py-1.5 rounded text-[12px] font-bold flex items-center gap-1 transition-all shadow-sm">
        <span className="rotate-180">↻</span> Reset
      </button>
      <button className="bg-[#007bff] hover:bg-[#0069d9] text-white px-4 py-1.5 rounded text-[12px] font-bold flex items-center gap-1 transition-all shadow-sm">
        <span>🔍</span> Cari
      </button>
    </div>

    {/* TABEL LAPORAN PERMAINAN */}
    <div className="border border-gray-200 rounded overflow-hidden shadow-sm bg-white mt-4">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[11px] border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-white border-b text-gray-800 font-bold uppercase">
              <th className="p-2.5 border-r">Info</th>
              <th className="p-2.5 border-r">Tipe</th>
              <th className="p-2.5 border-r">Debit</th>
              <th className="p-2.5 border-r">Credit</th>
              <th className="p-2.5 border-r">Saldo</th>
              <th className="p-2.5 border-r">Tanggal</th>
              <th className="p-2.5 border-r">Transaksi ID</th>
              <th className="p-2.5 border-r">Round ID</th>
              <th className="p-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b bg-white text-center">
              <td colSpan="9" className="p-6 text-gray-500 italic">Tidak ada data</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    {/* TOMBOL KEMBALI */}
    <div className="pt-2">
      <button 
        onClick={() => router.back()}
        className="bg-[#f39c12] hover:bg-[#e67e22] text-white px-4 py-1.5 rounded text-[12px] font-bold shadow-sm transition-all"
      >
        Kembali
      </button>
    </div>
  </div>
)}





{tabAktif === "Referral" && (
  <div className="space-y-6">
    {/* BARIS 1: FILTER TANGGAL */}
    <div className="flex gap-4">
      <div className="w-[180px]">
        <label className="text-[11px] text-gray-600 block mb-1">Dari Tanggal</label>
        <div className="relative border rounded border-gray-300 p-2 flex justify-between items-center bg-white">
          <input type="date" className="text-[12px] outline-none w-full" defaultValue="2026-03-11" />
        </div>
      </div>
      <div className="w-[180px]">
        <label className="text-[11px] text-gray-600 block mb-1">Sampai Tanggal</label>
        <div className="relative border rounded border-gray-300 p-2 flex justify-between items-center bg-white">
          <input type="date" className="text-[12px] outline-none w-full" defaultValue="2026-03-11" />
        </div>
      </div>
    </div>

    {/* TOMBOL CARI & RESET */}
    <div className="flex gap-2">
      <button className="bg-[#00c0ef] text-white px-3 py-1.5 rounded text-[11px] font-bold flex items-center gap-1">
        <span className="rotate-180 text-sm">↻</span> Reset
      </button>
      <button className="bg-[#007bff] text-white px-3 py-1.5 rounded text-[11px] font-bold flex items-center gap-1">
        <span>🔍</span> Cari
      </button>
    </div>

    {/* BARIS 2: STATISTIK RINGKASAN (BOX ABU-ABU) */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-[#eceff1] border border-gray-300 rounded p-3">
        <label className="text-[11px] text-gray-500 block mb-1">Referral Upline</label>
        <span className="text-[13px] font-bold text-gray-800 uppercase italic">
          {selectedUser?.upline || "dewadanaa"}
        </span>
      </div>
      <div className="bg-[#eceff1] border border-gray-300 rounded p-3">
        <label className="text-[11px] text-gray-500 block mb-1">Total Deposit - Withdraw</label>
        <span className="text-[13px] font-bold text-gray-800">Rp. 0,00</span>
      </div>
      <div className="bg-[#eceff1] border border-gray-300 rounded p-3">
        <label className="text-[11px] text-gray-500 block mb-1">Total TO Bet - Pembayaran</label>
        <span className="text-[13px] font-bold text-gray-800">Rp. 0,00</span>
      </div>
    </div>

    {/* BARIS 3: TABEL DETAIL REFERRAL */}
    <div className="border border-gray-200 rounded overflow-hidden shadow-sm bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[11px] border-collapse">
          <thead>
            <tr className="bg-white border-b text-gray-800 font-bold">
              <th className="p-2.5 border-r w-12">No.</th>
              <th className="p-2.5 border-r">Username</th>
              <th className="p-2.5 border-r text-center">Total Deposit</th>
              <th className="p-2.5 border-r text-center">Total Withdraw</th>
              <th className="p-2.5 border-r text-center">Total TO Bet</th>
              <th className="p-2.5 text-center">Total TO Pembayaran</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b bg-white">
              <td colSpan="6" className="p-6 text-center text-gray-500 italic">
                Tidak ada data
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* FOOTER TABEL */}
      <div className="bg-white p-2.5 text-right text-[11px] text-gray-600 border-t font-medium">
        Menampilkan sampai dari total 0 baris
      </div>
    </div>

    {/* TOMBOL KEMBALI */}
    <div className="pt-2">
      <button 
        onClick={() => router.back()}
        className="bg-[#f39c12] hover:bg-[#e67e22] text-white px-4 py-1.5 rounded text-[12px] font-bold shadow-sm transition-all"
      >
        Kembali
      </button>
    </div>
  </div>
)}

          {/* 4. TAB LAINNYA (Placeholder) */}
          

        </div>
      </div>
    </div>
  );
};