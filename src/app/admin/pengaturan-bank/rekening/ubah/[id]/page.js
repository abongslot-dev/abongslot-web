"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from '@supabase/supabase-js';
import { LayoutGrid } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function UbahRekeningPage() {
  const router = useRouter();
  const { id } = useParams(); // Mengambil ID dari URL
  const [listBank, setListBank] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
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

  // 1. Ambil Data Bank (untuk Dropdown) & Data Rekening yang akan diubah
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil daftar bank
        const { data: banks } = await supabase.from('banks').select('id, nama').order('nama');
        if (banks) setListBank(banks);

        // Ambil data rekening berdasarkan ID
        const { data: rekening, error } = await supabase
          .from('rekening_banks')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (rekening) {
          setFormData({
            member_group: rekening.member_group,
            bank_id: rekening.bank_id,
            nama_rekening: rekening.nama_rekening,
            nomor_rekening: rekening.nomor_rekening,
            tipe_potongan: rekening.tipe_potongan,
            persen_potongan: rekening.persen_potongan,
            sembunyikan: rekening.sembunyikan,
            urutan: rekening.urutan
          });
        }
      } catch (err) {
        alert("Gagal mengambil data: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const { error } = await supabase
        .from('rekening_banks')
        .update({
          member_group: formData.member_group,
          bank_id: formData.bank_id,
          nama_rekening: formData.nama_rekening,
          nomor_rekening: formData.nomor_rekening,
          tipe_potongan: formData.tipe_potongan,
          persen_potongan: parseFloat(formData.persen_potongan),
          sembunyikan: formData.sembunyikan,
          urutan: parseInt(formData.urutan)
        })
        .eq('id', id);

      if (error) throw error;
      alert("✅ Berhasil memperbarui rekening!");
      router.push("/admin/rekening-bank"); 
      router.refresh();
    } catch (err) {
      alert("❌ Gagal Update: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Memuat Data...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-[#333] font-sans">
      {/* Title & Breadcrumb */}
      <h1 className="text-2xl font-semibold mb-1">Ubah Rekening Bank</h1>
      <nav className="flex mb-4 text-sm text-blue-600">
        <span className="hover:underline cursor-pointer" onClick={() => router.push('/admin')}>Dashboard</span>
        <span className="mx-2 text-gray-400">/</span>
        <span className="hover:underline cursor-pointer" onClick={() => router.push('/admin/rekening-bank')}>Rekening Bank</span>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-500">Ubah Rekening Bank</span>
      </nav>

      {/* Main Card */}
      <div className="bg-white rounded border border-gray-300 shadow-sm overflow-hidden max-w-4xl">
        <div className="bg-[#f8f9fa] px-4 py-2 border-b border-gray-300 flex items-center gap-2">
           <LayoutGrid size={16} className="text-gray-600" />
           <span className="font-bold text-sm text-gray-700 uppercase">Ubah Rekening Bank</span>
        </div>

        <form onSubmit={handleUpdate} className="p-5 space-y-4">
          {/* Member Group */}
          <div>
            <label className="block text-[13px] text-gray-600 mb-1">Member Group</label>
            <select name="member_group" value={formData.member_group} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded text-sm bg-white">
              <option>Member Baru</option>
              <option>Member VIP</option>
            </select>
          </div>

          {/* Nama Bank */}
          <div>
            <label className="block text-[13px] text-gray-600 mb-1">Nama Bank</label>
            <select name="bank_id" value={formData.bank_id} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded text-sm bg-white">
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
              <select name="tipe_potongan" value={formData.tipe_potongan} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded text-sm bg-white">
                <option>Persen</option>
                <option>Flat</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-[13px] text-gray-600 mb-1">Persen Potongan Admin</label>
              <input type="number" step="0.01" name="persen_potongan" value={formData.persen_potongan} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-[13px] text-gray-600 mb-1">Sembunyikan</label>
            <select name="sembunyikan" value={formData.sembunyikan} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded text-sm bg-white">
              <option>Tidak</option>
              <option>Ya</option>
            </select>
          </div>

          <div>
            <label className="block text-[13px] text-gray-600 mb-1">Urutan</label>
            <input type="number" name="urutan" value={formData.urutan} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded text-sm" />
          </div>

          <div>
            <label className="block text-[13px] text-gray-600 mb-1">Gambar QRIS</label>
            <div className="flex items-center gap-2 border border-gray-300 rounded p-1 bg-gray-50">
              <input type="file" className="text-xs file:bg-gray-200 file:border-none file:px-3 file:py-1 file:rounded file:cursor-pointer" />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={updating} className="bg-[#0d6efd] hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm transition-all shadow-sm font-medium">
              {updating ? "Menyimpan..." : "Simpan"}
            </button>
            <button type="button" onClick={() => router.back()} className="bg-[#ffc107] hover:bg-yellow-500 text-black px-4 py-1.5 rounded text-sm transition-all shadow-sm font-medium">
              Kembali
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}