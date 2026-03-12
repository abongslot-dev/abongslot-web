"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from '@supabase/supabase-js';
import Link from "next/link";

// Inisialisasi Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function UbahBankPage() {
  const router = useRouter();
  const params = useParams(); // Mengambil ID dari URL
  const id = params.id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // State untuk Form
  const [nama, setNama] = useState("");
  const [tipe, setTipe] = useState("Bank");
  const [status, setStatus] = useState("Bank");
  const [register, setRegister] = useState("Ya");
  const [deposit, setDeposit] = useState("Ya");
  const [imgUrl, setImgUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  // 1. Ambil Data Bank yang Mau Diedit
  useEffect(() => {
    const fetchBankData = async () => {
      try {
        const { data, error } = await supabase
          .from('banks')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (data) {
          setNama(data.nama);
          setTipe(data.tipe);
          setStatus(data.status);
          setRegister(data.register ? "Ya" : "Tidak");
          setDeposit(data.deposit ? "Ya" : "Tidak");
          setImgUrl(data.img);
        }
      } catch (error) {
        console.error("Error fetching bank:", error.message);
      } finally {
        setFetching(false);
      }
    };

    if (id) fetchBankData();
  }, [id]);

  // 2. Fungsi Upload Gambar Baru
const handleUpload = async (e) => {
  try {
    setUploading(true);
    const file = e.target.files[0];
    if (!file) return;

    // Gunakan Timestamp agar nama file SELALU BARU & UNIK
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`; 
    const filePath = fileName;

    // Proses Upload
    let { error: uploadError } = await supabase.storage
      .from('logos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true // Menimpa jika ada file sama
      });

    if (uploadError) throw uploadError;

    // Ambil URL Publik yang baru
    const { data } = supabase.storage.from('logos').getPublicUrl(filePath);
    
    console.log("URL Gambar Baru:", data.publicUrl); // Cek di console log!
    setImgUrl(data.publicUrl); // Simpan URL baru ke state
    alert("✅ Gambar berhasil diupload!");

  } catch (error) {
    console.error("Detail Error Upload:", error);
    alert("❌ Gagal upload: " + error.message);
  } finally {
    setUploading(false);
  }
};

  // 3. Fungsi Simpan Perubahan (UPDATE)
const handleSimpan = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('banks')
        .update({
          nama: nama,
          tipe: tipe,
          status: status,
          register: register === "Ya",
          deposit: deposit === "Ya",
          img: imgUrl, // Link gambar baru Bos
        })
        .eq('id', id);

      if (error) throw error;

      alert("✅ Data Bank Berhasil Diperbarui!");
      
      // GANTI DUA BARIS ROUTER TADI DENGAN INI:
      window.location.href = '/admin/pengaturan-bank/bank';
      
    } catch (error) {
      alert("❌ Gagal Simpan: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-10 text-center">Memuat data...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-1">Ubah Bank</h1>
      <nav className="text-sm text-blue-600 mb-6 font-medium">
        <Link href="/admin">Dashboard</Link> / <Link href="/admin/pengaturan-bank/bank">Bank</Link> / Ubah Bank
      </nav>

      <div className="bg-white rounded shadow-sm border border-gray-200">
        <div className="p-3 bg-gray-50 border-b font-medium text-gray-700 flex items-center gap-2 text-sm">
          <span className="bg-gray-700 w-4 h-4 flex items-center justify-center text-white text-[10px]">田</span> Ubah Bank
        </div>
        
        <form onSubmit={handleSimpan} className="p-6 space-y-4 max-w-2xl">
          {/* NAMA */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Nama</label>
            <input 
              value={nama} onChange={(e) => setNama(e.target.value)}
              className="w-full border p-2 rounded focus:ring-1 focus:ring-blue-500 outline-none" 
              required
            />
          </div>

          {/* TIPE */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Tipe</label>
            <select value={tipe} onChange={(e) => setTipe(e.target.value)} className="w-full border p-2 rounded outline-none">
              <option>Bank</option>
              <option>E-Wallet</option>
            </select>
          </div>

          {/* STATUS */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border p-2 rounded outline-none">
              <option>Bank</option>
              <option>Maintenance</option>
            </select>
          </div>

          {/* REGISTER */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Untuk Register</label>
            <select value={register} onChange={(e) => setRegister(e.target.value)} className="w-full border p-2 rounded outline-none">
              <option>Ya</option>
              <option>Tidak</option>
            </select>
          </div>

          {/* DEPOSIT */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Untuk Deposit</label>
            <select value={deposit} onChange={(e) => setDeposit(e.target.value)} className="w-full border p-2 rounded outline-none">
              <option>Ya</option>
              <option>Tidak</option>
            </select>
          </div>

          {/* GAMBAR */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Gambar</label>
            <div className="border p-4 rounded-md flex flex-col gap-3">
              {imgUrl && (
                <div className="flex items-center gap-4 border p-2 w-fit rounded">
                  <img src={imgUrl} alt="Preview" className="h-12 object-contain" />
                  <button type="button" onClick={() => setImgUrl("")} className="bg-red-600 text-white text-[10px] px-2 py-1 rounded">× Hapus Gambar</button>
                </div>
              )}
              <input type="file" onChange={handleUpload} disabled={uploading} className="text-sm" />
              {uploading && <p className="text-xs text-blue-500 italic">Mengupload...</p>}
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-2 pt-4">
            <button 
              type="submit" disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded text-sm font-medium transition-all"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
            <button 
              type="button" onClick={() => router.push('/admin/pengaturan-bank/bank')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded text-sm font-medium transition-all"
            >
              Kembali
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}