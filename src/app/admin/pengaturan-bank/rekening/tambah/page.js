"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from '@supabase/supabase-js';
import { Save, ArrowLeft } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function TambahRekeningPage() {
  const router = useRouter();
  const [listBank, setListBank] = useState([]); // Untuk dropdown
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    member_group: "Member Baru",
    bank_id: "", // Kita simpan ID bank-nya
    nama_rekening: "",
    nomor_rekening: "",
    tipe_potongan: "Persen",
    persen_potongan: 0,
    sembunyikan: "Tidak",
    urutan: 0
  });

  // 1. Ambil data Bank dari tabel 'banks' untuk pilihan Dropdown
  useEffect(() => {
    const fetchBanks = async () => {
      const { data, error } = await supabase
        .from('banks')
        .select('id, nama')
        .order('nama', { ascending: true });
      if (!error) setListBank(data);
    };
    fetchBanks();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSimpan = async (e) => {
    e.preventDefault();
    if (!formData.bank_id || !formData.nama_rekening || !formData.nomor_rekening) {
      alert("Nama Bank, Nama Rekening, dan Nomor Rekening wajib diisi!");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('rekening_banks') // Pastikan nama tabelnya ini di Supabase
        .insert([{
          member_group: formData.member_group,
          bank_id: formData.bank_id,
          nama_rekening: formData.nama_rekening,
          nomor_rekening: formData.nomor_rekening,
          tipe_potongan: formData.tipe_potongan,
          persen_potongan: parseFloat(formData.persen_potongan),
          sembunyikan: formData.sembunyikan === "Ya",
          urutan: parseInt(formData.urutan)
        }]);

      if (error) throw error;

      alert("✅ Rekening Bank Berhasil Disimpan!");
      router.push("/admin/rekening-bank");
      router.refresh();
    } catch (err) {
      alert("❌ Gagal: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md border border-gray-200">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Save size={20} /> Tambah Rekening Bank
          </h2>
          <button onClick={() => router.back()} className="text-sm flex items-center gap-1 text-gray-600 hover:text-black">
            <ArrowLeft size={16} /> Kembali
          </button>
        </div>

        <form onSubmit={handleSimpan} className="p-6 space-y-4">
          {/* Member Group */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Member Group</label>
            <select name="member_group" value={formData.member_group} onChange={handleChange} className="w-full p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500">
              <option>Member Baru</option>
              <option>Member Lama</option>
              <option>VIP</option>
            </select>
          </div>

          {/* Nama Bank (Dropdown dari Database) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Bank</label>
            <select name="bank_id" value={formData.bank_id} onChange={handleChange} className="w-full p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500">
              <option value="">-- Pilih Bank --</option>
              {listBank.map((bank) => (
                <option key={bank.id} value={bank.id}>{bank.nama}</option>
              ))}
            </select>
          </div>

          {/* Nama Rekening */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Rekening</label>
            <input type="text" name="nama_rekening" value={formData.nama_rekening} onChange={handleChange} placeholder="Contoh: BUDI SETIAWAN" className="w-full p-2 border rounded" />
          </div>

          {/* Nomor Rekening */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Rekening</label>
            <input type="text" name="nomor_rekening" value={formData.nomor_rekening} onChange={handleChange} placeholder="Contoh: 1234567890" className="w-full p-2 border rounded" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Tipe Potongan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Potongan</label>
              <select name="tipe_potongan" value={formData.tipe_potongan} onChange={handleChange} className="w-full p-2 border rounded">
                <option>Persen</option>
                <option>Flat</option>
              </select>
            </div>
            {/* Nilai Potongan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Persen Potongan Admin</label>
              <input type="number" name="persen_potongan" value={formData.persen_potongan} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
          </div>

          {/* Sembunyikan & Urutan */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sembunyikan</label>
              <select name="sembunyikan" value={formData.sembunyikan} onChange={handleChange} className="w-full p-2 border rounded">
                <option>Tidak</option>
                <option>Ya</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Urutan</label>
              <input type="number" name="urutan" value={formData.urutan} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded shadow-lg transition-all">
              {loading ? "Menyimpan..." : "Simpan Rekening Bank"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}