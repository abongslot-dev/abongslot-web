"use client";
import React, { useState, useEffect } from "react";
import { Plus, Edit2, CheckCircle2, XCircle } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Inisialisasi Supabase (Ganti URL & KEY sesuai milik Bos)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function TogelPasaranPage() {
  const [pasaran, setPasaran] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // State Form Input
  const [form, setForm] = useState({
    nama: "",
    prize: "1 Prize",
    hari_tutup: "-",
    jam_tutup: "00:00",
    jam_buka: "00:00",
    urutan: 1,
    status: true,
  });

  // --- 1. AMBIL DATA DARI SUPABASE ---
  const fetchPasaran = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("togel_pasaran")
        .select("*")
        .order("urutan", { ascending: true });

      if (error) throw error;
      setPasaran(data || []);
    } catch (err) {
      console.error("Error fetch:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPasaran();
  }, []);

  // --- 2. SIMPAN DATA KE SUPABASE ---
  const handleSimpan = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("togel_pasaran").insert([form]);
      if (error) throw error;

      alert("Pasaran Berhasil Ditambahkan!");
      setShowModal(false);
      setForm({ nama: "", prize: "1 Prize", hari_tutup: "-", jam_tutup: "00:00", jam_buka: "00:00", urutan: 1, status: true });
      fetchPasaran(); // Refresh tabel
    } catch (err) {
      alert("Gagal Simpan: " + err.message);
    }
  };

  return (
    <div className="p-6 bg-[#f4f6f9] min-h-screen font-sans">
      <h1 className="text-3xl font-semibold text-gray-800">Togel Pasaran</h1>
      <p className="text-blue-500 text-sm mb-6">
        <span className="cursor-pointer hover:underline">Dashboard</span> / Togel Pasaran
      </p>

      <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
        {/* Header Tabel */}
        <div className="p-3 border-b bg-gray-50 flex justify-between items-center text-gray-700 font-bold">
          <div className="flex items-center gap-2 text-sm uppercase italic">
            <span className="text-[10px]">▦</span> Togel Pasaran
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-[#00a65a] text-white px-3 py-1.5 rounded text-[11px] flex items-center gap-1 hover:bg-[#008d4c] transition font-bold uppercase shadow-sm"
          >
            <Plus size={14} /> Tambah
          </button>
        </div>

        {/* Tabel Pasaran */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead>
              <tr className="bg-white text-gray-700 border-b uppercase font-bold">
                <th className="p-3 border-r w-12 text-center">No.</th>
                <th className="p-3 border-r">Nama</th>
                <th className="p-3 border-r">Prize</th>
                <th className="p-3 border-r">Hari Tutup</th>
                <th className="p-3 border-r">Waktu</th>
                <th className="p-3 border-r text-center w-20">Urutan</th>
                <th className="p-3 border-r text-center w-28">Status</th>
                <th className="p-3 text-center w-24">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" className="p-10 text-center italic text-gray-400">Loading data pasaran...</td></tr>
              ) : pasaran.length > 0 ? (
                pasaran.map((item, index) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-3 border-r text-center text-gray-500 font-medium">{index + 1}.</td>
                    <td className="p-3 border-r uppercase font-bold text-gray-800">{item.nama}</td>
                    <td className="p-3 border-r text-gray-600">{item.prize}</td>
                    <td className="p-3 border-r font-medium text-gray-500">{item.hari_tutup}</td>
                    <td className="p-3 border-r text-gray-700 font-medium">
                      Tutup : <span className="font-bold">{item.jam_tutup}</span> | Buka : <span className="font-bold">{item.jam_buka}</span>
                    </td>
                    <td className="p-3 border-r text-center font-bold text-gray-700">{item.urutan}</td>
                    <td className="p-3 border-r text-center">
                      <span className={`px-2 py-1 rounded-full text-[9px] font-bold flex items-center justify-center gap-1 border ${
                        item.status ? 'bg-[#d1f5ea] text-[#1a8a6d] border-[#a3e4d7]' : 'bg-red-50 text-red-600 border-red-200'
                      }`}>
                        {item.status ? <CheckCircle2 size={10}/> : <XCircle size={10}/>}
                        {item.status ? 'Aktif' : 'Non-Aktif'}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button className="bg-[#f39c12] text-white p-1.5 rounded hover:bg-[#e67e22] transition shadow-sm">
                        <Edit2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="8" className="p-10 text-center text-gray-400 italic">Data pasaran belum ada.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL TAMBAH (SIMPLE) --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 text-[13px]">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden border-t-4 border-green-500">
            <div className="p-4 border-b font-bold text-gray-700 uppercase">Tambah Pasaran Baru</div>
            <form onSubmit={handleSimpan} className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Nama Pasaran</label>
                <input type="text" className="w-full border p-2 rounded outline-none uppercase font-bold" required
                  value={form.nama} onChange={(e) => setForm({...form, nama: e.target.value.toUpperCase()})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Jam Tutup</label>
                  <input type="time" className="w-full border p-2 rounded outline-none" required
                    value={form.jam_tutup} onChange={(e) => setForm({...form, jam_tutup: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Jam Buka</label>
                  <input type="time" className="w-full border p-2 rounded outline-none" required
                    value={form.jam_buka} onChange={(e) => setForm({...form, jam_buka: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Urutan</label>
                <input type="number" className="w-full border p-2 rounded outline-none"
                  value={form.urutan} onChange={(e) => setForm({...form, urutan: e.target.value})} />
              </div>
              <div className="flex gap-2 pt-4">
                <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700">SIMPAN</button>
                <button type="button" onClick={() => setShowModal(false)} className="px-4 bg-gray-200 text-gray-600 py-2 rounded font-bold hover:bg-gray-300">BATAL</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}