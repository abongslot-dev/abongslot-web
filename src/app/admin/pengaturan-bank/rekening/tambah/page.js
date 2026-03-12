"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from '@supabase/supabase-js';
import { LayoutGrid } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function TambahRekeningPage() {
  const router = useRouter();
  const [listBank, setListBank] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    member_group: "Member Baru",
    bank_id: "",
    nama_rekening: "",
    nomor_rekening: "",
    tipe_potongan: "Persen",
    persen_potongan: 0,
    sembunyikan: "Tidak",
    urutan: 0
  });

  useEffect(() => {
    const fetchBanks = async () => {
      const { data } = await supabase.from('banks').select('id, nama').order('nama');
      if (data) setListBank(data);
    };
    fetchBanks();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSimpan = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('rekening_banks')
        .insert([{
          member_group: formData.member_group,
          bank_id: formData.bank_id,
          nama_rekening: formData.nama_rekening,
          nomor_rekening: formData.nomor_rekening,
          tipe_potongan: formData.tipe_potongan,
          persen_potongan: parseFloat(formData.persen_potongan),
          sembunyikan: formData.sembunyikan,
          urutan: parseInt(formData.urutan)
        }]);

      if (error) throw error;
      alert("✅ Berhasil menyimpan rekening!");
      router.push("/admin/pengaturan-bank/rekening"); 
      router.refresh();
    } catch (err) {
      alert("❌ Gagal: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-[#333] font-sans">
      {/* Title & Breadcrumb */}
      <h1 className="text-2xl font-semibold mb-1">Tambah Rekening Bank</h1>
      <nav className="flex mb-4 text-sm text-blue-600">
        <span className="hover:underline cursor-pointer" onClick={() => router.push('/admin')}>Dashboard</span>
        <span className="mx-2 text-gray-400">/</span>
        <span className="hover:underline cursor-pointer" onClick={() => router.push('/admin/rekening-bank')}>Rekening Bank</span>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-500">Tambah Rekening Bank</span>
      </nav>

      {/* Main Card */}
      <div className="bg-white rounded border border-gray-300 shadow-sm overflow-hidden max-w-4xl">
        <div className="bg-[#f8f9fa] px-4 py-2 border-b border-gray-300 flex items-center gap-2">
           <LayoutGrid size={16} className="text-gray-600" />
           <span className="font-bold text-sm text-gray-700 uppercase">Tambah Rekening Bank</span>
        </div>

        <form onSubmit={handleSimpan} className="p-5 space-y-4">
          {/* Member Group */}
          <div>
            <label className="block text-[13px] text-gray-600 mb-1">Member Group</label>
            <select name="member_group" value={formData.member_group} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400">
              <option>Member Baru</option>
              <option>Member VIP</option>
            </select>
          </div>

          {/* Nama Bank */}
          <div>
            <label className="block text-[13px] text-gray-600 mb-1">Nama Bank</label>
            <select name="bank_id" value={formData.bank_id} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded text-sm">
              <option value="">Pilih</option>
              {listBank.map(b => <option key={b.id} value={b.id}>{b.nama}</option>)}
            </select>
          </div>

          {/* Nama Rekening */}
          <div>
            <label className="block text-[13px] text-gray-600 mb-1">Nama Rekening</label>
            <input type="text" name="nama_rekening" value={formData.nama_rekening} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded text-sm" />
          </div>

          {/* Nomor Rekening */}
          <div>
            <label className="block text-[13px] text-gray-600 mb-1">Nomor Rekening</label>
            <input type="text" name="nomor_rekening" value={formData.nomor_rekening} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded text-sm" />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-[13px] text-gray-600 mb-1">Tipe Potongan Admin</label>
              <select name="tipe_potongan" value={formData.tipe_potongan} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded text-sm">
                <option>Persen</option>
                <option>Flat</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-[13px] text-gray-600 mb-1">Persen Potongan Admin</label>
              <input type="number" name="persen_potongan" value={formData.persen_potongan} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded text-sm" />
            </div>
          </div>

          {/* Sembunyikan */}
          <div>
            <label className="block text-[13px] text-gray-600 mb-1">Sembunyikan</label>
            <select name="sembunyikan" value={formData.sembunyikan} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded text-sm">
              <option>Tidak</option>
              <option>Ya</option>
            </select>
          </div>

          {/* Urutan */}
          <div>
            <label className="block text-[13px] text-gray-600 mb-1">Urutan</label>
            <input type="number" name="urutan" value={formData.urutan} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded text-sm" />
          </div>

          {/* Input Gambar QRIS */}
          <div>
            <label className="block text-[13px] text-gray-600 mb-1">Gambar QRIS</label>
            <div className="flex items-center gap-2 border border-gray-300 rounded p-1 bg-gray-50">
              <input type="file" className="text-xs file:bg-gray-200 file:border-none file:px-3 file:py-1 file:rounded file:cursor-pointer" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={loading} className="bg-[#0d6efd] hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm transition-all shadow-sm">
              {loading ? "Saving..." : "Simpan"}
            </button>
            <button type="button" onClick={() => router.back()} className="bg-[#ffc107] hover:bg-yellow-500 text-black px-4 py-1.5 rounded text-sm transition-all shadow-sm">
              Kembali
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}