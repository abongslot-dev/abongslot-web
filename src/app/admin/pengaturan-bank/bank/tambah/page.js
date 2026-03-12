"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from '@supabase/supabase-js';

// Pastikan inisialisasi Supabase ada di sini
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function TambahBankPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    nama: "",
    tipe: "Bank",
    status: "Pilih",
    register: "Tidak",
    deposit: "Tidak"
  });

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No file selected.");
  const [loading, setLoading] = useState(false); // Tambahkan loading biar keren

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleSimpan = async () => {
    if (!formData.nama || !file) {
      alert("Nama dan Gambar wajib diisi, Bos!");
      return;
    }

    setLoading(true);
    try {
      // 1. Upload Gambar ke Supabase Storage (Bucket: logos)
      const fileExt = file.name.split('.').pop();
      const fileNamePath = `${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('logos') 
        .upload(fileNamePath, file);

      if (uploadError) throw uploadError;

      // 2. Ambil Link URL Gambar
      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(fileNamePath);

      // 3. Simpan data ke Tabel 'banks'
      const { error: insertError } = await supabase
        .from('banks')
        .insert([{ 
          nama: formData.nama,
          tipe: formData.tipe,
          status: formData.status,
          register: formData.register === "Ya",
          deposit: formData.deposit === "Ya",
          img: publicUrl 
        }]);

      if (insertError) throw insertError;

      alert("✅ Bank Berhasil Ditambahkan!");
      router.push("/admin/pengaturan-bank/bank");
      router.refresh();
      
    } catch (err) {
      alert("❌ Gagal Simpan: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans text-gray-800">
      {/* HEADER TITLE */}
      <h1 className="text-3xl font-medium mb-1">Tambah Bank</h1>
      
      {/* BREADCRUMB */}
      <nav className="flex mb-6 text-sm">
        <Link href="/admin" className="text-blue-600 hover:underline font-medium">Dashboard</Link>
        <span className="mx-2 text-gray-400">/</span>
        <Link href="/admin/bank" className="text-blue-600 hover:underline font-medium">Bank</Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-500 font-light italic">Tambah Bank</span>
      </nav>

      {/* FORM CARD */}
      <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden max-w-4xl">
        {/* Card Header */}
        <div className="bg-[#f8f9fa] px-4 py-2.5 border-b border-gray-200 flex items-center gap-2">
          <div className="grid grid-cols-2 gap-0.5">
            <div className="w-1.5 h-1.5 bg-gray-700"></div>
            <div className="w-1.5 h-1.5 bg-gray-700"></div>
            <div className="w-1.5 h-1.5 bg-gray-700"></div>
            <div className="w-1.5 h-1.5 bg-gray-700"></div>
          </div>
          <span className="font-semibold text-gray-700 text-sm italic">Tambah Bank</span>
        </div>

        <div className="p-6 space-y-5">
          {/* Input Nama */}
          <div className="relative">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-[11px] text-gray-400 font-bold z-10">Nama</label>
            <input 
              name="nama"
              type="text" 
              value={formData.nama}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm relative z-0"
              placeholder="Masukkan nama bank..."
            />
          </div>

          {/* Select Tipe */}
          <div className="relative">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-[11px] text-gray-400 font-bold z-10">Tipe</label>
            <select 
              name="tipe"
              value={formData.tipe}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm appearance-none bg-white relative z-0"
            >
              <option value="Bank">Bank</option>
              <option value="E-Wallet">E-Wallet</option>
              <option value="Pulsa">Pulsa</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400 z-10">▼</div>
          </div>

          {/* Select Status */}
          <div className="relative">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-[11px] text-gray-400 font-bold z-10">Status</label>
            <select 
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm appearance-none bg-white relative z-0"
            >
              <option value="Pilih">Pilih</option>
              <option value="Bank">Bank</option>
              <option value="E-Wallet">E-Wallet</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400 z-10">▼</div>
          </div>

          {/* Select Untuk Register */}
          <div className="relative">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-[11px] text-gray-400 font-bold z-10">Untuk Register</label>
            <select 
              name="register"
              value={formData.register}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm appearance-none bg-white relative z-0"
            >
              <option value="Tidak">Tidak</option>
              <option value="Ya">Ya</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400 z-10">▼</div>
          </div>

          {/* Select Untuk Deposit */}
          <div className="relative">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-[11px] text-gray-400 font-bold z-10">Untuk Deposit</label>
            <select 
              name="deposit"
              value={formData.deposit}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm appearance-none bg-white relative z-0"
            >
              <option value="Tidak">Tidak</option>
              <option value="Ya">Ya</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400 z-10">▼</div>
          </div>

          {/* Upload Gambar */}
          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700">Gambar</label>
            <div className="flex items-stretch shadow-sm">
              <label className="cursor-pointer bg-[#efefef] border border-gray-300 border-r-0 px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 transition-colors font-medium">
                Browse...
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
              <div className="flex-1 border border-gray-300 px-3 py-2 text-sm text-gray-400 bg-white font-light flex items-center italic">
                {fileName}
              </div>
            </div>
            <p className="text-[11px] text-red-500 italic font-semibold">nb: ukuran [200 x 80] px</p>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-2 pt-2">
            <button 
              onClick={handleSimpan}
              className="bg-[#007bff] hover:bg-blue-700 text-white px-6 py-2 rounded text-sm transition-all shadow-md font-bold active:scale-95"
            >
              Simpan
            </button>
            <button 
              onClick={() => router.back()}
              className="bg-[#ffc107] hover:bg-yellow-500 text-black px-6 py-2 rounded text-sm transition-all shadow-md font-bold active:scale-95"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}